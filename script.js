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

let eventStored;

/***********
 functions 
 ***********/

// DONE
let clickedItemIsBlob = function (itemsId) {
  if (itemsId === undefined) return 'undefined';
  return itemsId.substring(0, 4) === 'blob';
};

// DONE
let getBlobData = function (itemsId) {
  const blobData = {};
  if (itemsId.substring(5, 10) === 'group') blobData.blobType = 'group';
  else if (itemsId.substring(5, 11) === 'single') blobData.blobType = 'single';
  else if (itemsId.substring(5, 10) === 'shade') blobData.blobType = 'shade';

  if (blobData.blobType === 'group')
    blobData.blobColor = itemsId.substring(11, 14);
  else if (blobData.blobType === 'single')
    blobData.blobColor = itemsId.substring(12, 15);
  else if (blobData.blobType === 'shade')
    blobData.blobColor = itemsId.substring(11, 17);

  return blobData;
};

let updateColorPalette = function (blobType, blobColor) {
  clearCurrentSelection();

  // TODO FIX DEBUG TODO NOTE

  let wasUpdateSuccessful = '';
  if (blobType === 'group') updateGroupsPalette(blobColor);
  else if (blobType === 'single') updateSinglesPalette(blobColor, 'listener');
  else if (blobType === 'shade') updateShadesPalette(blobColor);
  return wasUpdateSuccessful;
};

// DONE
const clearCurrentSelection = function () {
  console.log(
    'clearCurrentSelection > currentSelection.group:',
    currentSelection.group
  );

  document.getElementById(currentSelection.group).style =
    'border: 1px solid black';
  console.log(currentSelection.single);
  document.getElementById(currentSelection.single).style =
    'border: 1px solid black';
  console.log(currentSelection.shade);
  document.getElementById(currentSelection.shade).style =
    'border: 1px solid black';

  // NOTE (1/2) a red blob with a 'blob-group-0' id is present in the blob-group set,
  // this is to allow having a red blob displayed at both ends of the blob-group set.
  // however, internally, this has to be handled as a special case in this code block
  // by clearing group blob 'blob-group-0' each time it is selected
  // this problem originates from the fact that only one element can have the
  // 'blob-group-360' id and, therefore, the first blob representing color 360 has the
  // 'blob-group-0' id
  document.getElementById('blob-group-0').style = 'border: 1px solid black';
};

// DONE
const updateGroupsPalette = function (newGroupColor) {
  clearCurrentSelection();
  if (newGroupColor === '0') {
    //NOTE (2/2) - see note (1/2) for more detail
    // a red blob with a 'blob-group-0' id is present in the blob-group set,
    // this is to allow having a red blob displayed at both ends of the blob-group set.
    // however, internally, a zero is converted to 360 to simplify the program's logic
    // and this special case is dealt with as an exeption in this code block
    newSelection.group = 'blob-group-' + newGroupColor;
    document.getElementById(newSelection.group).style =
      'border: 4px solid black';
    newGroupColor = '360';
  } else {
    newSelection.group = 'blob-group-' + newGroupColor;
    document.getElementById(newSelection.group).style =
      'border: 4px solid black';
  }

  // if (blobColor === '0') blobColor = '360';
  updateSinglesPalette(newGroupColor, 'group');
  updateShadesPalette(newGroupColor);
};

const updateSinglesPalette = function (newGroupColor, origin) {
  if (origin === 'group') {
    const newSingleColorArray = createNewSingleColorArray(newGroupColor);
    const oldSingleColorArray = createOldSingleColorArray(newGroupColor);

    updateSinglesPaletteDisplay(oldSingleColorArray, newSingleColorArray);
    currentSelection.group = 'blob-group-' + newGroupColor;
    currentSelection.single = 'blob-single-' + newGroupColor;
    currentSelection.shade = 'blob-shade-070040';
    console.log(
      'updateSinglesPalette >  currentSelection.group:',
      currentSelection.group
    );
  }
};

// DONE
// REFACTOR > DRY see createOldSingleColorArray
const createNewSingleColorArray = function (newGroupColor) {
  let newSingleColorArray = [];
  let newColorIndex = 0;

  let newBaseColor = Number(newGroupColor);

  // NOTE: the HSL color space is circular, before 0deg comes 359deg and after 360deg comes 1deg
  // this code handles that
  for (let i = -14; i <= 14; i++) {
    newColorIndex = 14 + i;
    console.log('createNewSingleColorArray >  newColorIndex:', newColorIndex);
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

// DONE
// REFACTOR > DRY see createNewSingleColorArray
const createOldSingleColorArray = function (newGroupColor) {
  let oldSingleColorArray = [];
  let oldColorIndex = 0;

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

// DONE
const updateSinglesPaletteDisplay = function (
  oldSingleColorArray,
  newSingleColorArray
) {
  let oldId = '';
  let newId = '';

  // change ids
  for (let i = 0; i <= 28; i++) {
    oldId = 'blob-single-' + oldSingleColorArray[i];
    newId = 'blob-single-' + newSingleColorArray[i];

    console.log('updateSinglesPaletteDisplay >  oldId, newId', oldId, newId);

    // add class with the new id
    document.querySelector('#' + oldId).classList.add(newId);

    // remove existing id
    document.querySelector('.' + newId).setAttribute('id', '');

    // add new id
    document.querySelector('.' + newId).setAttribute('id', newId);

    // remove class with the new id
    document.querySelector('#' + newId).classList.remove(newId);

    const blobData = getBlobData(newId);

    // update single color blobs display
    document.getElementById(newId).style =
      'background-color: hsl(' + blobData.blobColor + ', 100%, 50%);';
    document.getElementById(newId).textContent = blobData.blobColor;
  }
};

// DONE
const updateShadesPalette = function (blobColor) {
  return;
};

/*****************
 event listeners 
 ******************/

/** program's main flow : (01) - start here */
document.querySelector('body').addEventListener('click', function (event) {
  console.log('event listener >  here');
  const clickedElementsId = event.target.id.toLowerCase();
  eventStored = event;
  main(clickedElementsId);
});

/***************
 program logic
 ***************/

/** program's main flow : (02) - main process starts here */
let main = function (clickedItemsId) {
  console.log('main >  clickedItemsId', clickedItemsId);
  if (clickedItemIsBlob(clickedItemsId)) {
    const blobData = getBlobData(clickedItemsId);
    const blobType = blobData.blobType;
    const blobColor = blobData.blobColor;

    updateColorPalette(blobType, blobColor);
  }
  console.log('main >  currentSelection.group:', currentSelection.group);
  console.log('main >  currentSelection.single:', currentSelection.single);
  console.log("main >  EVENT'S CICLE COMPLETE!!");
};
