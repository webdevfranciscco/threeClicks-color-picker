'use strict';

/* #############################################
     variables
   ############################################# */

let currentSelection = {
  group: 'blob-group-285',
  single: 'blob-single-279',
  shade: 'blob-shade-279070040',
};

let newSelection = {
  group: '',
  single: '',
  shade: '',
};

/* #############################################
     functions
   ############################################# */

const /* ********************************************* */
  markInitialSelection = function () {
    document.getElementById(currentSelection.group).style.border =
      '4px solid black';

    document.getElementById(currentSelection.single).style.border =
      '4px solid black';

    document.getElementById(currentSelection.shade).style.border =
      '4px solid black';
  };

const /* ********************************************* */
  clickedItemIsBlob = function (itemsId) {
    if (itemsId === undefined) return 'undefined';
    return itemsId.substring(0, 4) === 'blob';
  };

const /* ********************************************* */
  getBlobData = function (itemsId) {
    const blobData = {};
    if (itemsId.substring(5, 10) === 'group') {
      blobData.blobType = 'group';
      blobData.blobColor = itemsId.substring(11, 14);
    } else if (itemsId.substring(5, 11) === 'single') {
      blobData.blobType = 'single';
      blobData.blobColor = itemsId.substring(12, 15);
    } else if (itemsId.substring(5, 10) === 'shade') {
      blobData.blobType = 'shade';
      blobData.blobColor = itemsId.substring(11, 20);
    }

    return blobData;
  };

const /* ********************************************* */
  updateColorPalette = function (blobType, blobColor) {
    if (blobType === 'group') updateGroupsPalette(blobColor);
    else if (blobType === 'single')
      updateSinglesPalette(blobColor, 'clickListenerForSingle');
    else if (blobType === 'shade') {
      updateShadesPalette(blobColor, 'clickListenerForShade');
    }
  };

const /* ********************************************* */
  clearGroupSelection = function () {
    document.getElementById(currentSelection.group).style.border =
      '1px solid black';
  };

const /* ********************************************* */
  clearSingleSelection = function () {
    // NOTE (a1/2)

    // a red blob with a 'blob-group-0' id is present in the blob-group set,
    // this is to allow having a red blob displayed at both ends of the blob-group set.
    // however, internally, this has to be handled as a special case in this code block
    // by changing its id to blob 'blob-group-360', so that the single colors set
    // is updated accordingly

    // this problem originates from the fact that only one element can have the
    // 'blob-group-360' id and, therefore, the first blob representing color 360 has the
    // 'blob-group-0' id

    // handle the exception when group blob color is 0, but single blob color is 360:
    if (currentSelection.single === 'blob-single-0')
      currentSelection.single = 'blob-single-360';
    document.getElementById(currentSelection.single).style.border =
      '1px solid black';
  };

const /* ********************************************* */
  clearShadeSelection = function () {
    document.getElementById(currentSelection.shade).style.border =
      '1px solid black';
  };

const /* ********************************************* */
  updateGroupsPalette = function (newGroupColor) {
    clearGroupSelection();
    'updateGroupsPalette() : newGroupColor', newGroupColor;
    markBlobWithCursor(newGroupColor, 'group');
    updateSinglesPalette(newGroupColor, 'updateGroupsPaletteFunction');
  };

const /* ********************************************* */
  markBlobWithCursor = function (color, type) {
    // type can be either 'group', 'single' or 'shade'
    document.getElementById('blob-' + type + '-' + color).style.border =
      '4px solid black';
  };

const /* ********************************************* */
  updateSinglesPalette = function (newGroupColor, origin) {
    clearSingleSelection();
    if (origin === 'updateGroupsPaletteFunction') {
      const newSingleColorArray = createNewSingleColorArray(newGroupColor);
      const oldSingleColorArray = createOldSingleColorArray();

      updateSinglesPaletteDisplay(oldSingleColorArray, newSingleColorArray);

      currentSelection.group = 'blob-group-' + newGroupColor;
      currentSelection.single = 'blob-single-' + newGroupColor;

      if (newGroupColor === '0')
        currentSelection.shade = `blob-shade-360100050`;
      else
        currentSelection.shade = `blob-shade-${newGroupColor
          .toString()
          .padStart(3, '0')}100050`;
    } else if (origin === 'clickListenerForSingle') {
      markBlobWithCursor(newGroupColor, 'single');

      currentSelection.single = 'blob-single-' + newGroupColor;

      updateShadesPalette(newGroupColor, 'updateSinglesPaletteFunction');
    }

    document.getElementById('large-blob').style.backgroundColor =
      'hsl(' + newGroupColor + ', 100%, 50%)';
  };

// :DRY: - see createOldSingleColorArray
const /* ********************************************* */
  createNewSingleColorArray = function (newGroupColor) {
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

// :DRY: - see createNewSingleColorArray
const /* ********************************************* */
  createOldSingleColorArray = function () {
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

const /* ********************************************* */
  updateSinglesPaletteDisplay = function (
    oldSingleColorArray,
    newSingleColorArray
  ) {
    for (let i = 0; i <= 28; i++) {
      //
      // assign temporary ids to single blobs
      document
        .getElementById('blob-single-' + oldSingleColorArray[i])
        .setAttribute('id', 'temp-id-' + i);
    }

    for (let i = 0; i <= 28; i++) {
      //
      // change the old id for the new id
      // on each blob DOM element of the singles palette
      document
        .getElementById('temp-id-' + i)
        .setAttribute('id', 'blob-single-' + newSingleColorArray[i]);

      // update the hue of the single color blobs
      document.getElementById(
        'blob-single-' + newSingleColorArray[i]
      ).style.backgroundColor =
        'hsl(' + newSingleColorArray[i] + ', 100%, 50%)';
    }

    let singleBlobLabelId = '';

    for (let i = 0; i <= 28; i++) {
      //
      singleBlobLabelId = `sbl${i}`;

      console.log(
        'updateSinglesPaletteDisplay[] : i, singleBlobLabelId',
        i,
        singleBlobLabelId
      );
      document.getElementById(singleBlobLabelId).textContent =
        newSingleColorArray[i];
    }

    markBlobWithCursor(newSingleColorArray[14], 'single');

    updateShadesPalette(
      newSingleColorArray[14],
      'updateSinglesPaletteDisplayFunction'
    );
  };

const /* ********************************************* */
  updateShadesPaletteDisplay = function (oldColor, newColor) {
    let ss = 0;
    let ll = 0;
    let id = '';
    let currentId = '';
    let temporaryId = '';
    let newId = '';

    // set all shade blobs to a temporary id
    for (let s = 0; s <= 100; s += 10) {
      ss = s.toString().padStart(3, '0');
      for (let l = 0; l <= 100; l += 10) {
        ll = l.toString().padStart(3, '0');
        currentId =
          'blob-shade-' + oldColor.toString().padStart(3, '0') + ss + ll;
        temporaryId = 'blob-shade-777' + ss + ll;

        // assign a temporary id to a shade blob
        document.getElementById(currentId).setAttribute('id', temporaryId);
      }
    }

    // set all shade blobs to the new id
    for (let s = 0; s <= 100; s += 10) {
      ss = s.toString().padStart(3, '0');
      for (let l = 0; l <= 100; l += 10) {
        ll = l.toString().padStart(3, '0');
        temporaryId = 'blob-shade-777' + ss + ll;
        newId = 'blob-shade-' + newColor.toString().padStart(3, '0') + ss + ll;

        // assign new id to a shade blob
        document.getElementById(temporaryId).setAttribute('id', newId);
        document.getElementById(
          newId
        ).style.backgroundColor = `hsl(${newColor}, ${ss}%, ${ll}%)`;
      }
    }
  };

const /* ********************************************* */
  updateShadesPalette = function (newColor, origin) {
    if (
      origin === 'updateSinglesPaletteDisplayFunction' ||
      origin === 'updateSinglesPaletteFunction'
    ) {
      clearShadeSelection();
      const selectedShadeBlobId = currentSelection.shade;
      const oldColor = getBlobData(selectedShadeBlobId).blobColor;
      const oldHue = getShadeData(oldColor).hue;
      updateShadesPaletteDisplay(oldHue, newColor);

      const newShade = `${newColor.toString().padStart(3, '0')}100050`;

      currentSelection.shade = `blob-shade-${newShade}`;

      markBlobWithCursor(newShade, 'shade');

      document.getElementById('large-blob').style.backgroundColor =
        'hsl(' + newColor.toString().substring(0, 3) + ', 100%, 50%)';
    } else {
      clearShadeSelection();
      markBlobWithCursor(newColor, 'shade');
      document.getElementById('large-blob').style.backgroundColor =
        'hsl(' +
        newColor.toString().substring(0, 3) +
        ', ' +
        newColor.toString().substring(3, 6) +
        '%, ' +
        newColor.toString().substring(6, 10) +
        '%)';
      currentSelection.shade = `blob-shade-${newColor}`;
    }
  };

const /* ********************************************* */
  getShadeData = function (blobColor) {
    const shadeData = {};

    shadeData.hue = blobColor.substring(0, 3);
    shadeData.saturation = blobColor.substring(3, 6);
    shadeData.luminance = blobColor.substring(6, 10);

    return shadeData;
  };

const /* ********************************************* */
  main = function (clickedItemsId) {
    if (clickedItemIsBlob(clickedItemsId)) {
      const blobData = getBlobData(clickedItemsId);
      const blobType = blobData.blobType;
      const blobColor = blobData.blobColor;

      //document.querySelector('h3').textContent = clickedItemsId; //:DELETE: Debugging code

      // clearShadeSelection();

      updateColorPalette(blobType, blobColor);
    }
  };

/* #############################################
     program logic
   ############################################# */

/*
   ***********************************
   ** PROGRAM EXECUTION STARTS HERE **
   ***********************************
   
    by marking the color blobs, corresponding to the 
    initial color selection, with a black 4px border:
    
      currentSelection = {
        group: 'blob-group-285',
        single: 'blob-single-279',
        shade: 'blob-shade-279070040',
      };
  
*/

markInitialSelection();

/*
 a 'click' event listener is set up...
 
 upon clicking on the screen,
 main() is called with the clicked element's id
 as argument, starting the corresponding response   
 */

/* #############################################
      event listeners
   ############################################# */

document.querySelector('body').addEventListener('click', function (event) {
  //
  const clickedElementsId = event.target.id.toLowerCase();

  main(clickedElementsId);
});

/* #############################################
     developer notes
   ############################################# */

// explore what happens with single id when a new group id is chosen

/* #############################################
     HIGHLIGHT TAGS & SNIPPETS
   ############################################# */

// document

// background-color

// console.log

// :REFACTOR: /ref

// :HIGHLIGHT: /hig

// :DELETE: /del

// :FIX: /fix

// :DEBUG: /dev

// :TODO: /tod

// :DOING: /doi

// :DONE: /don

// :BUG: /bug

// :NOTE: /not
