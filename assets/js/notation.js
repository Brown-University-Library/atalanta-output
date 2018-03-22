



/*

  The tempo is being read from the DOM but the tempo is not taking hold
  in terms of what's being returned for timing in Verovio
  
  Try editing the sample MEI directly and putting in the tempo there; maybe the regex method 
  isn't doing it
  
  (Didnt' work - defaulting to 60 BPM)
  
  Have to implement update(time) functions for the CMN view
  
  Have to give the model a play() method that starts a setInterval that tells the view 
  manager to updateAllViews
  
  May want to have a Verovio-type API for other visualizations (e.g. )


*/



(function () {

  'use strict';
  
  // Constants
  
  let MAIN_CLASS_NAME = 'atalanta-notation',
      VIZ_CLASS_NAME = 'atalanta-notation-viz',
      CMN_VIZ_CLASS_NAME = VIZ_CLASS_NAME + '-cmn',
      AUDIO_VIZ_CLASS_NAME = VIZ_CLASS_NAME + '-audio',
      AUDIO_VIZ_MP3_ATTR_NAME = 'data-mp3',
      AUDIO_VIZ_TEMPO_ATTR_NAME = 'data-tempo',
      VEROVIO_OPTIONS = {
        pageHeight: 2000,
        pageWidth: 2000,
        scale: 30,
        ignoreLayout: 1,
        adjustPageHeight: 1
        // adjustPageHeight: true
      };

  // Globals
  
  var audioContext;
  
  // Given a DOM node (through this), make a music notation component
  
  function createMusicComponent() {
    
    let containerNode = $(this);
    
    // Get rid of default content for browsers with no javascript
    
    containerNode.css('backgroundImage', 'none');

    // Take MEI code, remove tempo information, replace with that tempo
    //  indicated by the tempo attribute in the markup
    
    function setMeiTempo(meiData) {
      
      // Get tempo from child of main container 
      // TODO: also look in main container
      
      let tempoValue = Number(containerNode.find('*[' + AUDIO_VIZ_TEMPO_ATTR_NAME + ']')
                                           .attr(AUDIO_VIZ_TEMPO_ATTR_NAME)),
          tempo =  tempoValue === NaN ? 60 : tempoValue;

      console.log("Tempo read from DOM: " + tempo);
      
      // Take out existing tempo data
      //  and insert new tempo data
      
      return meiData.replace(/\s+midi.bpm="[^"]"/g, '')
                    .replace(/<scoreDef\s+/, '<scoreDef midi.bpm="' + tempo + '" ');
    }
    
    // Create verovio toolkit object

    function createVerovioObject(meiFileURL) {
      
      let verovioToolkit = new verovio.toolkit();
      
      // Load the MEI file using a HTTP GET
      
      $.ajax({
          url: meiFileURL, dataType: 'text', success: function(meiData) {

            // verovioToolkit.loadData(setMeiTempo(meiData)); 
            // COMMENTED OUT ABOVE B/C VEROVIO DOESN'T SEEM TO BE READING THE TEMPO FROM THE MEI
            verovioToolkit.loadData(meiData);
            
            // Convert to MIDI to get timing info
            
            verovioToolkit.renderToMidi();
            
            // Create views, model, controllers
            
            let viewManager = ViewManager(containerNode, verovioToolkit),
                model = Model(viewManager, verovioToolkit);
            
            initControllers(model, containerNode);
            
            // createViewsAndModel(verovioToolkit); OLD CODE - DEFUNCT?

            // Create onclick events to jump to time
            // TODO: test this
            
            $('.note').click(function() {
                var id = $(this).attr('id');
                var time = verovioToolkit.getTimeForElement(id);
                // $('#player').midiPlayer.seek(time);
                console.log("NOTE TIME: " + time);
            });
          }
      });
    }
    
    // Create view manager, model - DEFUNCT??
    
    function createViewsAndModel(verovioToolkit) {
      let viewManager = ViewManager(containerNode, verovioToolkit),
          model = Model(viewManager, verovioToolkit);
      
      // MORE HERE
    }

    // Create main interface buttons - TODO
    
    // MAIN
    
    function init() {
      let meiFileURL = containerNode.attr('data-mei');
      createVerovioObject(meiFileURL);
    }
    
    init();
  }
  
  // OBJECT: VIEW MANAGER
  //  The viewManager scans the DOM for markup and 
  //   creates all views (*-viz) including audio-viz and CMN-viz
  //  Responsible for receiving direction from Model and relaying it
  //   to the views
  
  function ViewManager(containerNode, verovioToolkit) {

    var views;
    
    function createViews() {
      
      let views = [];
      
      containerNode.find('.' + VIZ_CLASS_NAME).each(function () {
        let viewContainer = $(this);
        if (viewContainer.hasClass(CMN_VIZ_CLASS_NAME)) {
          views.push(ViewCMN(viewContainer, verovioToolkit));
        } else if (viewContainer.hasClass(AUDIO_VIZ_CLASS_NAME)) {
          views.push(ViewAudio(viewContainer));
        } // ADD MORE VIEWS HERE AS THEY ARE CREATED
      });
      
      return views;
    }
    
    function renderAllViews() {
      views.forEach(function(view) {
        view.render();
      });
    }

    function updateAllViews(timeInMilliseconds) {
      
      let TEMP_TEMPO = 56 * 4;
      
      let timeAdjustedForTempo = timeInMilliseconds * (TEMP_TEMPO / 60); // TEMP KLUDGE
      
      views.forEach(function(view) {
        // view.update(timeInMilliseconds);
        view.update(timeAdjustedForTempo); // KLUDGE
      });
    }
    
    function stopAllViews() {
      views.forEach((view) => view.stop())
    }
    
    function setMute(muteStatus) {
      console.log("MUTE CHANGE FOR ALL VIEWS");
      views.forEach((view) => view.onMuteChange(muteStatus));
    }
    
    function init() {
      views = createViews();
      renderAllViews();      
    }
    
    init();

    return {
      update: updateAllViews,
      stop: stopAllViews,
      setMute: setMute
    };
  }
  
  // OBJECT: CMN VIEW
  
  function ViewCMN(viewContainer, verovioToolkit) {
/*
                pageHeight = $(document).height() * 100 / zoom ;
                pageWidth = $(window).width() * 100 / zoom ;
                options = {
                            pageHeight: pageHeight,
                            pageWidth: pageWidth,
                            scale: zoom,
                            adjustPageHeight: true
                        };
                vrvToolkit.setOptions(options);
  */  
    
    let zoom = 30,
        pageHeight = viewContainer.height() * 100 / zoom,
        pageWidth  = viewContainer.width()  * 100 / zoom,
        highlightedNotes = [],
        HIGHLIGHT_COLOR = '#f00';

    function removeFallbackImage() {
      viewContainer.css('background-image', 'none');
    }
    
    function render() {

      //let pageHeight = viewContainer.height() * 100 / zoom,
      //    pageWidth  = viewContainer.width()  * 100 / zoom;
      
      VEROVIO_OPTIONS.pageHeight = viewContainer.height() * 100 / zoom;
      VEROVIO_OPTIONS.pageWidth  = viewContainer.width()  * 100 / zoom;
      VEROVIO_OPTIONS.scale = zoom;
      
      verovioToolkit.setOptions(VEROVIO_OPTIONS);
      viewContainer.html(verovioToolkit.renderPage(1));
    }
    
    function update(timeInMilliseconds) {

      // Turn off currently highlighted notes
      
      highlightedNotes.forEach(
        (note) => note.attr('fill', '#000').attr('stroke', '#000')
      );
      
      // Highlight notes
      
      highlightedNotes = [];
      
      verovioToolkit.getElementsAtTime(timeInMilliseconds).notes.forEach(
        (note) => {
          let highLightedNote = $('#' + note);
          highLightedNote.attr('fill', HIGHLIGHT_COLOR).attr('stroke', HIGHLIGHT_COLOR);
          highlightedNotes.push(highLightedNote);
        }
      );
      
      // $('#m-103').attr("fill", "#0c0").attr("stroke", "#0c0");
    }
    
    function onMuteChange(muteStatus) {
      
      // THIS SHOULD BE HANDLED BY CSS
      
      console.log("MUTE CHANGE FOR CMN");

      muteStatus.forEach((mute, index) => {
        $('.measure .staff:nth-of-type(' + (index + 1) + ')')
          .attr('opacity', mute ? '0.2': '1.0');
        $('.measure .barLineAttr path:nth-of-type(' + (index + 1) + ')')
          .attr('opacity', mute ? '0.2': '1.0');
      })
      
      // For each 
      //  Gray out 
      //  $('.measure .staff:nth-of-type(2)').attr('opacity','0.2');
      //  Gray out bar lines
      //  $('.measure .barLineAttr path:nth-of-type(2)').attr('opacity', '0.2');
    }
    
    function init() {
      removeFallbackImage();
      window.cmn = render;
    }

    init();
    
    return {
      render: render,
      update: update,
      stop: function () {},
      onMuteChange: onMuteChange
    }
  }
  
  // OBJECT: AUDIO VIEW
  //  The audioview manages multiple audio tracks
  //  It also reads the @data-mp3 attribute for mp3 filenames
  
  function ViewAudio(viewContainer, verovioToolkit) {

    let isPlaying = false,
        tracks = [];
    
    // update() is roughly the idea of a "play audio" function.
    //   IF the audio is already playing, then ignore
    //   IF the audio is not playing, then start it playing
    //     at the timeInMilliseconds
    
    function update(timeInMilliseconds) {
      
      if (!isPlaying) {
        tracks.forEach((track) => track.play(timeInMilliseconds));
        isPlaying = true;
      }
    }
    
    // Stop playing the audio
    
    function stop() {
      console.log("STOP TRACKS");
      tracks.forEach((track) => track.stop());
      isPlaying = false;
    }
    
    // Given the attribute string, returns an array-of-arrays
    //  [tracks][voices]
    
    function getMp3Filenames(mp3FilenameString) {
      
      return mp3FilenameString.split(';') // This should be a regex ...
                              .reduce(function (acc, x) {
                                acc.push(x.split(','))
                                return acc;
                              }, []);
    }
    
    function onMuteChange(muteStatusArray) {
      
      // Bring down volume for tracks
      console.log("MUTE CHANGE FOR AUDIO");
      console.log(muteStatusArray);
      muteStatusArray.forEach((muteStatus, i) => tracks[i].mute(muteStatus));
    }
    
    function init() {
      
      // Load filenames for MP3 files from attribute
      
      let allTrackFilenames = getMp3Filenames(viewContainer.attr(AUDIO_VIZ_MP3_ATTR_NAME));

      // Create objects for each track (main voice + reverb)
      // TODO: implement reverb
      
      tracks = allTrackFilenames.map(getViewAudioTrack);
      console.log(tracks);
      
      // Track object: volume, pan, mute, play, pause, jumpTo

    }
    
    init();
    
    return {
      render: function () {},
      update: update,
      stop: stop,
      onMuteChange: onMuteChange
    }
  }
  
  // OBJECT: AUDIO TRACK
  
  // The track object is responsible for playing and stopping an
  //  audio file for a single vocal part AND its reverb.
  // It also mutes when told
  
  function getViewAudioTrack(trackFilenames) {

    let bufferList, 
        bufferLoader, 
        sources,
        isMuted = false,
        gainNode = null;

    function play(startTimeInMilliseconds) {
      
      // Take each buffer and connect to audio output
      
      sources = bufferList.map((buffer) => {
        
        // Get buffer source node
        
        let source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        // Get gain node
        
        if (!audioContext.createGain)
          audioContext.createGain = audioContext.createGainNode;
        
        gainNode = audioContext.createGain();
        
        // Connect source node to gain node & gain to output
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return source;
      });
      
      /*
      
      
      sources = bufferList.map((buffer) => {
        let source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        return source;
      });
      
      */

      // Start audio

      console.log("TRACK IS BEING PLAYED starting at time " + startTimeInMilliseconds);
      // console.log(bufferList);
      sources.forEach((source) => {
        console.log("START SOURCE: ");
        console.log(source.start);
        source.start(startTimeInMilliseconds / 1000);
        // AudioBufferSourceNode.start([when][, offset][, duration]);
      });
    }
    
    // Stop audio
    
    function stop() {
      console.log("TRACK IS BEING STOPPED");
      sources.forEach(source => source.stop(0));
    }

    function finishedLoading(buffers) { 
      bufferList = buffers;
      console.log('Loaded audio files:' + trackFilenames);
      // play(); // TEMP -- for testing
    }
    
    function setGain(gain) {
      console.log("Setting gain to " + gain);
      gainNode.gain.value = gain * gain;
    }    
    
    function mute(muteStatus) {
      isMuted = (muteStatus);
      console.log("TURNING MUTE STATUS TO " + muteStatus);
      setGain(muteStatus ? 0 : 1);
    }

    function init() {
      // Load audio
      bufferLoader = new AudioLoader(audioContext, trackFilenames, finishedLoading);
      bufferLoader.load();        
    }

    init();

    return {
      play: play,
      stop: stop,
      mute: mute
    }
  }
  
  // OBJECT: BUFFERLOADER
  
  // Loads an audio buffer
  // Code from https://www.html5rocks.com/en/tutorials/webaudio/intro/
  
  function AudioLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }

  AudioLoader.prototype.loadBuffer = function(url, index) {
    
    // Load buffer asynchronously
    
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
      
      // Asynchronously decode the audio file data in request.response
      
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = function() {
      alert('AudioLoader: XHR error');
    }

    request.send();
  }

  AudioLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
  }
  
  // OBJECT: MODEL
  
  function Model(viewManager) {

    let timerId, startTime;
    
    // "Play" means to schedule updates for views
    // Start time is set to beginning
    
    function play() {
      startTime = new Date().valueOf();
      timerId = setInterval(function(){
        let timePassed = (new Date().valueOf()) - startTime;
        viewManager.update(timePassed);
      }, 100); // TODO - SHOULD NOT BE HARD CODED
    }
    
    // "Stop" means stop the scheduled updates
    //   and tell the ViewManager to stop()
    
    function stop() {
      clearInterval(timerId);
      timerId = undefined;
      viewManager.stop();
    }
    
    function setMute(muteStatus) {
      viewManager.setMute(muteStatus);
    }
    
    return {
      play: play,
      stop: stop,
      setMute: setMute
    };
  }
  
  
  // OBJECT: Controller (is this necessary?)
  
  function initControllers(model, containerNode) {

    containerNode.find('.atalanta-notation-start').click(() => model.play());
    containerNode.find('.atalanta-notation-stop').click(() => model.stop());
    
    let muteButtons = containerNode.find('.atalanta-notation-mute-track');
    
    muteButtons.click((e) => {
      $(e.target).toggleClass('mute');
      let muteStatus = muteButtons.map((x,o) => $(o).hasClass('mute')).get();
      model.setMute(muteStatus);
    });
  }
  
  
  // Create an audio context
  // TODO: a fallback if WebAudio API not available
  
  function getAudioContext() {
    
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      return new AudioContext();
    }
    catch(e) {
      console.log('Web Audio API is not supported in this browser');
      return null;
    }
  }
  
  // MAIN, UPON PAGE LOAD - identify music component markup in the HTML and instantiate
  
  function initWhenPageLoaded() {
    
    // Check for audio players in the markup.
    //  If exists, create a shared AudioContext
    //  (only need one for whole page)
    
    if ($('.' + AUDIO_VIZ_CLASS_NAME).length)
      audioContext = getAudioContext();
    
    // Find components and initialize each in turn
    
    $('.' + MAIN_CLASS_NAME).each(createMusicComponent);
  }
  
  // MAIN, BEFORE PAGE LOAD
  
  function init() {
    
    // ALSO REMEMBER TO LOAD MP3s RIGHT AWAY (you could also load MEIs as well)
    // TODO
    
    // Register event - call main() when page loaded
    
    document.addEventListener('DOMContentLoaded', initWhenPageLoaded);
    
    window.AudioLoader = AudioLoader; // TEMP FOR DEBUGGING
  }
  

  init();

  
})()