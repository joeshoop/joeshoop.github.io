var obj, cursorX, cursorY, beingDragged, dragLimits, editorRect, editorTop, editorLeft, editorHeight, editorWidth;

// Define steps for each handle

var draggableHandles = {
  'typography': {
    'class': 'typography',
    'title': 'Typography',
    'labels': {
      'top': 'Large',
      'right': 'Heavy',
      'bottom': 'Small',
      'left': 'Thin'
    },
    
    'x': ['thin', 'medium', 'heavy'],
    'y': ['small', 'medium', 'large']
  },

  'color': {
    'class': 'color',
    'title': 'Color',
    'labels': {
      'top': 'Bright',
      'right': 'Rich',
      'bottom': 'Dark',
      'left': 'Pale'
    },

    'x': ['pale', 'rich'],
    'y': ['dark', 'bright']
  },

  'artdirection': {
    'class': 'artdirection',
    'title': 'Art Direction',
    'labels': {
      'top': 'Maximal',
      'right': '2017',
      'bottom': 'Minimal',
      'left': '1995'
    },

    'x': ['1995', '1996', '1997', '1998', '2017'],
    'y': ['minimal', 'maximal']
  }
};

// console.log(draggableHandles['typography']['x'][0]);

function draggableVars(){ // define variables for editor
  editorArea = document.querySelector('.editor').getBoundingClientRect();
  editorTop = editorArea.top;
  editorLeft = editorArea.left
  editorWidth = editorArea.width;
  editorHeight = editorArea.height;
}

function draggableEdges(){
  // Define edges of safe area as px: Top Edge, Right Edge, Bottom Edge, Left Edge
  dragLimits = [0, editorWidth - obj.offsetWidth, editorHeight - obj.offsetHeight, 0];
}

window.onload = function(){ // set variables on load
    draggableVars();

    var handles = []

    // create an array from the top level items in draggableHandles
    for (var keys in draggableHandles) {
      if (draggableHandles.hasOwnProperty(keys)) {
        handles.push(keys);
      }
    };

    
    // to do:
    // option to have default properties on load
    // set handle positioning in JSON up above instead of css
    // change different styles for each card
    // make properties align with css rules for each step
    // option to randomize x & y properties on load
    // option for user to click randomize
    // support local storage to save handle positions between sessions

    // for each top level item in that array, create a handle in the html
    for (handle in handles) {
      var currentHandle = draggableHandles[handles[handle]]
      console.log(currentHandle.title);

      document.querySelector('.editor-handles').innerHTML +=
        '<div class="draggable-handle ' + currentHandle.class + '" data-draggable="true" data-draggable-type="' + currentHandle.class + '"> \
          ' + currentHandle.title + '\
          <ul class="draggable-directions"> \
            <li class="up"> \
              <span class="label">' + currentHandle.labels.top + '</span> \
            </li> \
            <li class="right"> \
              <span class="label">' + currentHandle.labels.right + '</span> \
            </li> \
            <li class="down"> \
              <span class="label">' + currentHandle.labels.bottom + '</span> \
            </li> \
            <li class="left"> \
              <span class="label">' + currentHandle.labels.left + '</span> \
            </li> \
          </ul> \
        </div>';
    }

    // document.querySelector('.editor').innerHTML ='<div class="draggable-handle' + key + '" data-draggable="true" data-draggable-type="' + key + '">' + key['title'] + '<ul class="draggable-directions"><li class="up"><span class="label">' + key['labels']['top'] + '</span></li><li class="right"><span class="label">' + key['labels']['right'] + '</span></li><li class="down"> <span class="label">' + key['labels']['bottom'] + '</span></li><li class="left"><span class="label">' + key['labels']['left'] + '</span></li></ul></div>';
  };


var resizeEnd;
window.onresize = function() { // reset variables after a resize
  // need to reset position of boxes after resize as well
    clearTimeout(resizeEnd);
    resizeEnd = setTimeout(function() {
        draggableVars();
    }, 500);
}

document.body.classList.add('typography-x-thin', 'typography-y-large');

function click(e) {
  obj = e.target;

    if (obj.dataset.draggable) {
        
        document.body.classList.remove("draggable-dropped");

        draggableEdges();

        obj.classList.add("being-dragged");

        // Distance you clicked from top left corner of box.
        cursorOffsetY = cursorY - obj.offsetTop;
        cursorOffsetX = cursorX - obj.offsetLeft;

        beingDragged = true;

    }
}

function move(e) {
  // Track the coordinates of the mouse cursor, and move cursor lines with mouse.
  if (e.pageX) {

      cursorX = e.pageX; // X coordinate based on page, not viewport.
      cursorY = e.pageY; // Y coordinate based on page, not viewport.

      document.querySelector('.cursor-y').style.top = cursorY + 'px';
      document.querySelector('.cursor-x').style.left = cursorX + 'px';

  }

  if (beingDragged) { // If an object is being dragged, make it follow the coordinates of the mouse cursor.

    dragLimits = [0, editorWidth - obj.offsetWidth, editorHeight - obj.offsetHeight, 0];
    
    // limit draggable range to edges of editor
    newBoxTop = Math.max(Math.min(cursorY - cursorOffsetY, dragLimits[2]), 0);
    newBoxLeft = Math.max(Math.min(cursorX - cursorOffsetX, dragLimits[1]), 0);

    obj.style.top = newBoxTop + 'px';
    obj.style.left = newBoxLeft + 'px';

    if (newBoxTop < (editorWidth/2)) {  
    // (should be based on center middle of draggable box, rather than on top left coordinate.)
    // should also account for the number of items in each arrays above (lines 4-11)
    // should work on each box independently
      document.body.classList.replace("typography-x-thin", "typography-x-heavy");
    } else {
      document.body.classList.replace("typography-x-heavy", "typography-x-thin");
    }

    if (newBoxLeft < (editorWidth/2)) {
      document.body.classList.replace('typography-y-large', "typography-y-small");
    } else {
      document.body.classList.replace('typography-y-small', "typography-y-large");
    }
  }
}

function drop() {
  document.body.classList.add("draggable-dropped");

  obj.classList.remove("being-dragged");
  beingDragged = false;
  obj = false;
  newBoxTop = false;
  newBoxLeft = false;
}

document.onmousedown = click;
document.onmousemove = move;
document.onmouseup = drop;
