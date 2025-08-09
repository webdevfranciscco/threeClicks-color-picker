'use strict';

/***********
 variables 
 ***********/

let currentSelection = {
  group: 'blob-group-285',
  single: 'blob-single-279',
  shade: 'blob-shade-070040',
};

let newSelection = {
  group: '',
  single: '',
  shade: '',
};

/***********
 functions 
 ***********/

const markCurrentSelection = function () {
  document.getElementById(currentSelection.group).style =
    'border: 4px solid black;';

  document.getElementById(currentSelection.single).style.border =
    '4px solid black';

  document.getElementById(currentSelection.shade).style =
    'border: 4px solid black;';
};

let clickedItemIsBlob = function (itemsId) {
  if (itemsId === undefined) return 'undefined';
  return itemsId.substring(0, 4) === 'blob';
};

let getBlobData = function (itemsId) {
  const blobData = {};
  if (itemsId.substring(5, 10) === 'group') {
    blobData.blobType = 'group';
    blobData.blobColor = itemsId.substring(11, 14);
  } else if (itemsId.substring(5, 11) === 'single') {
    blobData.blobType = 'single';
    blobData.blobColor = itemsId.substring(12, 15);
  } else if (itemsId.substring(5, 10) === 'shade') {
    blobData.blobType = 'shade';
    blobData.blobColor = itemsId.substring(11, 17);
  }

  return blobData;
};

let updateColorPalette = function (blobType, blobColor) {
  if (blobType === 'group') updateGroupsPalette(blobColor);
  else if (blobType === 'single') updateSinglesPalette(blobColor, 'listener');
  else if (blobType === 'shade') updateShadesPalette(blobColor);
};

const clearCurrentSelection = function () {
  document.getElementById(currentSelection.group).style.border =
    '1px solid black';

  document.getElementById(currentSelection.single).style.border =
    '1px solid black';

  document.getElementById(currentSelection.shade).style.border =
    '1px solid black';

  // NOTE (a1/2)
  // a red blob with a 'blob-group-0' id is present in the blob-group set,
  // this is to allow having a red blob displayed at both ends of the blob-group set.
  // however, internally, this has to be handled as a special case in this code block
  // by clearing group blob 'blob-group-0' each time it is selected
  // this problem originates from the fact that only one element can have the
  // 'blob-group-360' id and, therefore, the first blob representing color 360 has the
  // 'blob-group-0' id
  document.getElementById('blob-group-0').style.border = '1px solid black';
};

const updateGroupsPalette = function (newGroupColor) {
  document.getElementById('blob-group-' + newGroupColor).style =
    'border: 4px solid black;';
  updateSinglesPalette(newGroupColor, 'group');
};

const updateSinglesPalette = function (newGroupColor, origin) {
  if (origin === 'group') {
    const newSingleColorArray = createNewSingleColorArray(newGroupColor);
    const oldSingleColorArray = createOldSingleColorArray();

    console.log(
      'updateGroupsPalette() :  >>  oldSingleColorArray, newSingleColorArray',
      oldSingleColorArray,
      newSingleColorArray
    );

    // :DONE:  TODOS  ok hasta aquí...
    updateSinglesPaletteDisplay(oldSingleColorArray, newSingleColorArray);

    currentSelection.group = 'blob-group-' + newGroupColor;
    currentSelection.single = 'blob-single-' + newGroupColor;
    currentSelection.shade = 'blob-shade-070040';
  } else if (origin === 'listener') {
    // :FIX: - This else may not be needed
  }
};

// :REFACTOR: > DRY see createOldSingleColorArray
const createNewSingleColorArray = function (newGroupColor) {
  let newSingleColorArray = [];
  let newColorIndex = 0;

  let newBaseColor = Number(newGroupColor);

  // NOTE (b1/2)
  //  the HSL color space is circular, before 0deg comes 359deg and after 360deg comes 1deg
  // this code handles that by making sure we go from 259 to 360 to 1 and viceversa
  // same for createOldSingleColorArray() see note (b2/2)
  for (let i = -14; i <= 14; i++) {
    newColorIndex = 14 + i;
    if (newBaseColor + i < 0) {
      newSingleColorArray[newColorIndex] = 360 - newBaseColor + i;
    } else if (newBaseColor + i > 360) {
      newSingleColorArray[newColorIndex] = i;
    } else if (newBaseColor + i === 0) {
      newSingleColorArray[newColorIndex] = 360;
    } else {
      newSingleColorArray[newColorIndex] = newBaseColor + i;
    }
  }
  return newSingleColorArray;
};

// :REFACTOR: > DRY see createNewSingleColorArray
const createOldSingleColorArray = function () {
  let oldSingleColorArray = [];
  let oldColorIndex = 0;

  // NOTE (b2/2)
  // same case as indicated in note (b1/2) for createNewSingleColorArray()

  let oldBaseColor = Number(getBlobData(currentSelection.group).blobColor);

  for (let i = -14; i <= 14; i++) {
    oldColorIndex = 14 + i;
    if (oldBaseColor + i < 0) {
      oldSingleColorArray[oldColorIndex] = 360 - oldBaseColor + i;
    } else if (oldBaseColor + i > 360) {
      oldSingleColorArray[oldColorIndex] = i;
    } else if (oldBaseColor + i === 0) {
      oldSingleColorArray[oldColorIndex] = 360;
    } else {
      oldSingleColorArray[oldColorIndex] = oldBaseColor + i;
    }
  }
  return oldSingleColorArray;
};

const updateSinglesPaletteDisplay = function (
  oldSingleColorArray,
  newSingleColorArray
) {
  // :DEBUG: Vamos aquí...
  for (let i = 0; i <= 28; i++) {
    //
    // change the old id for the new id
    // on each blob DOM element of the singles palette
    document
      .getElementById('blob-single-' + oldSingleColorArray[i])
      .setAttribute('id', 'blob-single-' + newSingleColorArray[i]);

    // update the hue of the single color blobs
    document.getElementById('blob-single-' + newSingleColorArray[i]).style =
      'background-color: hsl(' + newSingleColorArray[i] + ', 100%, 50%);';

    document.getElementById(
      'blob-single-' + newSingleColorArray[i]
    ).textContent = newSingleColorArray[i];
  }

  document.getElementById(
    'blob-single-' + newSingleColorArray[14]
  ).style.border = '4px solid black';

  updateShadesPalette(newSingleColorArray[14]);

  document.getElementById('large-blob').style =
    'background-color: hsl(' + newSingleColorArray[14] + ', 100%, 50%);';
};

const updateShadesPalette = function (blobColor) {
  return;
};

let main = function (clickedItemsId) {
  if (clickedItemIsBlob(clickedItemsId)) {
    const blobData = getBlobData(clickedItemsId);
    const blobType = blobData.blobType;
    const blobColor = blobData.blobColor;

    document.querySelector('h3').textContent = clickedItemsId; // :TODO: :DELETE: - Delete me - Code used only for debugging purposes

    clearCurrentSelection();

    updateColorPalette(blobType, blobColor);
  }
};

/***************
 program logic
 ***************/

/*
   program execution starts here

   by marking the color blobs, corresponding to the 
   initial color selection, with a black 4px border:

        currentSelection = {
            group: 'blob-group-285',
            single: 'blob-single-279',
            shade: 'blob-shade-070040',
          };
          
*/

markCurrentSelection();

/*
   then a 'click' event listener is set up

   upon clicking on the screen,
   main() is called with the clicked element's id
   as argument, starting the corresponding response   
*/

/*****************
 event listeners 
 ******************/

document.querySelector('body').addEventListener('click', function (event) {
  //
  const clickedElementsId = event.target.id.toLowerCase();

  main(clickedElementsId);
});

//
// :TODO:
//
// :FIX: when clicking the 0 blob of the group palette, selecting cusrosr stop working
// explore what happens with single id when a new group id is chosen

// ****************
//  HIGHLIGHT TAGS
// ****************

// :REFACTOR:

// :DELETE:

// :FIX:

// :DEBUG:

// :TODO:

// :DOING:

// :DONE:

// :BUG:

// :NOTE:

// document

// console.log

// background-color
