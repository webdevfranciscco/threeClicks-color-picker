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

let eventStored; //TODO -  Check if needed and delete if not

let clickedEvent = ''; //TODO - Delete after debugging

/***********
 functions 
 ***********/

const markCurrentSelection = function () {
  document.getElementById(currentSelection.group).style =
    'border: 4px solid black';

  document.getElementById(currentSelection.single).style =
    'border: 4px solid black';

  document.getElementById(currentSelection.shade).style =
    'border: 4px solid black';
};

markCurrentSelection();

// DONE
let clickedItemIsBlob = function (itemsId) {
  if (itemsId === undefined) return 'undefined';
  return itemsId.substring(0, 4) === 'blob';
};

// DONE
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
  // TODO FIX DEBUG TODO NOTE

  let wasUpdateSuccessful = ''; // TODO - Check if this is still used properly, then decide to  either complete or eliminate
  if (blobType === 'group') updateGroupsPalette(blobColor);
  else if (blobType === 'single') updateSinglesPalette(blobColor, 'listener');
  else if (blobType === 'shade') updateShadesPalette(blobColor);
  return wasUpdateSuccessful;
};

//DONE
const clearCurrentSelection = function () {
  document.getElementById(currentSelection.group).style =
    'border: 1px solid black';

  document.getElementById(currentSelection.single).style =
    'border: 1px solid black';

  document.getElementById(currentSelection.shade).style =
    'border: 1px solid black';

  // NOTE (a1/2)
  // a red blob with a 'blob-group-0' id is present in the blob-group set,
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
  if (newGroupColor === '0') {
    //NOTE (a2/2) - see note (a1/2) for more detail
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
};

const updateSinglesPalette = function (newGroupColor, origin) {
  if (origin === 'group') {
    const newSingleColorArray = createNewSingleColorArray(newGroupColor);
    const oldSingleColorArray = createOldSingleColorArray(newGroupColor);

    updateSinglesPaletteDisplay(oldSingleColorArray, newSingleColorArray);
    currentSelection.group = 'blob-group-' + newGroupColor;
    currentSelection.single = 'blob-single-' + newGroupColor;
    currentSelection.shade = 'blob-shade-070040';
  } else if (origin === 'listener') {
    // FIX - This else may not be needed
  }
};

// DONE
// REFACTOR > DRY see createOldSingleColorArray
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

// DONE
// REFACTOR > DRY see createNewSingleColorArray
const createOldSingleColorArray = function (newGroupColor) {
  let oldSingleColorArray = [];
  let oldColorIndex = 0;

  // NOTE (b2/2)
  // seame case as indicated in note (b1/2) for createNewSingleColorArray()

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
  for (let i = 28; i >= 0; i--) {
    let tempId = ''; // TODO DELETE - debugging code
    oldId = 'blob-single-' + oldSingleColorArray[i];
    newId = 'blob-single-' + newSingleColorArray[i];

    document.querySelector('#' + oldId).setAttribute('id', newId);

    const blobData = getBlobData(newId);

    //LOG
    // console.log('updateSinglesPaletteDisplay >  blobData', blobData);

    // update single color blobs display
    document.getElementById(newId).style =
      'background-color: hsl(' + blobData.blobColor + ', 100%, 50%);';
    document.getElementById(newId).textContent = blobData.blobColor;
    //LOG
    console.log(
      'updateSinglesPaletteDisplay >  oldId, newId blobColor',
      oldId,
      newId,
      blobData.blobColor
    );

    //LOG
    // console.log(
    //   'updateSinglesPaletteDisplay > oldId, clickedEvent, newId:::',
    //   oldId,
    //   clickedEvent,
    //   newId
    // );
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
  //LOG
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
  clickedEvent = clickedItemsId;
  //LOG
  console.log('main >  clickedItemsId', clickedItemsId);
  if (clickedItemIsBlob(clickedItemsId)) {
    const blobData = getBlobData(clickedItemsId);
    const blobType = blobData.blobType;
    const blobColor = blobData.blobColor;

    document.querySelector('h3').textContent = clickedEvent; //TODO DELETE - Delete me - Code for debugging

    clearCurrentSelection();

    updateColorPalette(blobType, blobColor);
    //LOG
    console.log('main >  CLICK EVENT PROCESS COMPLETE >>>>>>>>');
    console.log('');
  }
};

// REFACTOR LOG DELETE FIX TODO DOING DONE DEBUG NOTE
//
// NEXT STEP:
//
// explore what happens with single id when a new group id is chosen
