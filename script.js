'use strict';

/* #############################################
     variables
   ############################################# */

let currentSelection = {
  group: 'blob-group-285',
  single: 'blob-single-279',
  shade: 'blob-shade-279070040',
  shadeSaturationLabel: 'v070',
  shadeLuminanceLabel: 'h040',
};

let newSelection = {};

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
  main = function (clickedItemsId) {
    if (clickedItemIsBlob(clickedItemsId)) {
      const blobData = getBlobData(clickedItemsId);
      const blobType = blobData.blobType;
      let blobColor = blobData.blobColor;

      // standardize blobColor and set to default shade
      // (maximum saturation & middle luminance, 100%, 50%)
      if (blobType === 'single' || blobType === 'group')
        blobColor = blobColor.padStart(3, '0') + '100050';

      updateColorPalette(blobType, blobColor);
    }
  };

const /* ********************************************* */
  clickedItemIsBlob = function (itemsId) {
    if (itemsId === undefined) return 'undefined';
    return itemsId.substring(0, 4) === 'blob';
  };

const /* ********************************************* */
  updateColorPalette = function (blobType, blobColor) {
    if (blobType === 'group') updateGroupsPalette('group', blobColor);
    else if (blobType === 'single') updateSinglesPalette('single', blobColor);
    else if (blobType === 'shade') updateShadesPalette('shade', blobColor);
  };

const /* ********************************************* */
  updateGroupsPalette = function (blobType, blobColor) {
    clearGroupSelection();
    const hue = getBlobColorData(blobColor).hue;
    markBlobWithCursor(blobType, hue);
    updateSinglesPalette(blobType, blobColor);
  };

const /* ********************************************* */
  clearGroupSelection = function () {
    document.getElementById(currentSelection.group).style.border =
      '1px solid black';
  };

const /* ********************************************* */
  getBlobColorData = function (blobColor) {
    const shadeData = {};

    shadeData.hue = blobColor.substring(0, 3);
    shadeData.saturation = blobColor.substring(3, 6);
    shadeData.luminance = blobColor.substring(6, 10);

    return shadeData;
  };

const /* ********************************************* */
  markBlobWithCursor = function (type, hue) {
    // type can be either 'group', 'single' or 'shade'
    document.getElementById('blob-' + type + '-' + hue).style.border =
      '4px solid black';
  };

const /* ********************************************* */
  updateSinglesPalette = function (blobType, blobColor) {
    const hue = getBlobColorData(blobColor).hue;
    if (blobType === 'group') {
      //
      let oldGroupColor = getBlobData(currentSelection.group).blobColor;
      const oldSingleColorArray = createSingleColorArray(oldGroupColor);

      const newSingleColorArray = createSingleColorArray(hue);

      clearSingleSelection();
      updateSinglesPaletteDisplay(oldSingleColorArray, newSingleColorArray);

      currentSelection.group = 'blob-group-' + hue;
      currentSelection.single = 'blob-single-' + hue;

      updateColorResultDisplay(blobColor);

      if (hue === '000') currentSelection.shade = `blob-shade-360100050`;
      else currentSelection.shade = `blob-shade-${hue}100050`;
      currentSelection.single = 'blob-single-' + hue;
    } else if (blobType === 'single') {
      clearSingleSelection();
      markBlobWithCursor('single', hue);

      currentSelection.single = 'blob-single-' + hue;

      updateShadesPalette('single', blobColor);
    }
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
  createSingleColorArray = function (groupColor) {
    let singleColorArray = [];
    let colorIndex = 0;

    let baseColor = Number(groupColor);

    // NOTE (a)
    //
    //  the HSL color space is circular, before 0 degrees comes 359 degrees
    //  and after 360 degrees comes 1 degree
    //
    // this code handles that by making sure we go from 359 to 360 to 1 and viceversa
    // also, see note (b)

    for (let i = -14; i <= 14; i++) {
      colorIndex = 14 + i;
      if (baseColor + i < 0) {
        singleColorArray[colorIndex] = 360 - baseColor + i;
      } else if (baseColor + i > 360) {
        singleColorArray[colorIndex] = i;
      } else if (baseColor + i === 0) {
        singleColorArray[colorIndex] = 360;
      } else {
        singleColorArray[colorIndex] = baseColor + i;
      }
    }
    return singleColorArray;
  };

const /* ********************************************* */
  clearSingleSelection = function () {
    // NOTE (b)

    // a red blob with a 'blob-group-0' id is present in the blob-group set,
    // this is to allow having a red blob displayed at both ends of the blob-group set.
    // however, internally, this has to be handled as a special case in this code block
    // by changing its id to blob 'blob-group-360', so that the single colors set
    // is updated accordingly

    // this problem originates from the fact that only one element can have the
    // 'blob-group-360' id and, therefore, the first blob representing color 360 has the
    // 'blob-group-0' id

    // this handles the exception when group blob color is 0, but single blob color is 360:
    if (currentSelection.single === 'blob-single-000')
      currentSelection.single = 'blob-single-360';

    document.getElementById(currentSelection.single).style.border =
      '1px solid black';
  };

const /* ********************************************* */
  updateColorResultDisplay = function (blobColor) {
    // convert to number with the + sign and then back to string to remove leading zeros
    const resultHue = +blobColor.substring(0, 3).toString();
    const resultSaturation = +blobColor.substring(3, 6).toString();
    const resultLuminance = +blobColor.substring(6, 10).toString();

    document.getElementById('large-blob').style.backgroundColor =
      'hsl(' +
      resultHue +
      ', ' +
      resultSaturation +
      '%, ' +
      resultLuminance +
      '%)';

    document.getElementById(
      'hsl-result'
    ).textContent = `HSL = (${resultHue}, ${resultSaturation}%,${resultLuminance}%)`;
    currentSelection.shade = `blob-shade-${blobColor}`;

    // Convert hsl to hex (convert arguments to number using the + sign)
    const hexResult = hslToHex(+resultHue, +resultSaturation, +resultLuminance);

    document.getElementById('hex-result').textContent = `HEX = #${hexResult}`;
  };

const /* ********************************************* */
  hslToHex = function (hue, saturation, luminance) {
    const rgb = hslToRgb(hue, saturation, luminance);
    const hex = rgbToHex(...rgb);

    // round the result to an integer hexadecimal number
    // by converting to decimal and back to hex
    let decimal = Math.round(parseInt(hex, 16));
    let roundedHex = decimal.toString(16);

    return roundedHex.padStart(6, '0');
  };

const /* ********************************************* */
  /* this code from here:https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/ */
  hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

const /* ********************************************* */
  /* this code from here:https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/ */
  rgbToHex = (r, g, b) =>
    ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

const /* ********************************************* */
  updateSinglesPaletteDisplay = function (
    oldSingleColorArray,
    newSingleColorArray
  ) {
    let oldHue = '';
    let newHue = '';
    for (let i = 0; i <= 28; i++) {
      oldHue = oldSingleColorArray[i].toString().padStart(3, '0');
      // assign temporary ids to single blobs
      document
        .getElementById('blob-single-' + oldHue)
        .setAttribute('id', 'temp-id-' + i);
    }

    for (let i = 0; i <= 28; i++) {
      newHue = newSingleColorArray[i].toString().padStart(3, '0');
      // change the old id for the new id
      // on each blob DOM element of the singles palette
      document
        .getElementById('temp-id-' + i)
        .setAttribute('id', 'blob-single-' + newHue);

      // update the hue of the single color blobs
      document.getElementById('blob-single-' + newHue).style.backgroundColor =
        'hsl(' + newSingleColorArray[i] + ', 100%, 50%)';
    }

    let singleBlobLabelId = '';

    for (let i = 0; i <= 28; i++) {
      singleBlobLabelId = `sbl${i}`;

      // update the labels of the single color blobs palette to the new blob hue
      document.getElementById(singleBlobLabelId).innerText =
        newSingleColorArray[i].toString();
    }

    const selectedHue = newSingleColorArray[14].toString().padStart(3, '0');

    markBlobWithCursor('single', selectedHue);

    const newBlobColor = selectedHue.toString() + '070040';

    updateShadesPalette('single', newBlobColor);
  };

const /* ********************************************* */
  updateShadesPalette = function (origin, blobColor) {
    if (origin === 'single') {
      clearShadeSelection();

      const currentShadeBlobId = currentSelection.shade;
      const oldColor = getBlobData(currentShadeBlobId).blobColor;
      const oldHue = getBlobColorData(oldColor).hue;

      const newHue = getBlobColorData(blobColor).hue;

      updateShadesPaletteDisplay(oldHue, newHue);

      const newShade = `${newHue.toString().padStart(3, '0')}100050`;

      currentSelection.shade = `blob-shade-${newShade}`;

      markBlobWithCursor('shade', newShade);

      clearSelectedShadeLabels();
      markSelectedShadeLabels(newShade);

      updateColorResultDisplay(blobColor);
    } else if (origin === 'shade') {
      clearShadeSelection();
      markBlobWithCursor('shade', blobColor);

      clearSelectedShadeLabels();
      markSelectedShadeLabels(blobColor);

      updateColorResultDisplay(blobColor);
    }
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
  clearShadeSelection = function () {
    document.getElementById(currentSelection.shade).style.border =
      '1px solid black';
  };

const /* ********************************************* */
  clearSelectedShadeLabels = function () {
    const saturationLabelId = currentSelection.shadeSaturationLabel;

    document.getElementById(saturationLabelId).style.fontWeight = '100';
    document.getElementById(saturationLabelId).style.color = 'black';
    document.getElementById(saturationLabelId).style.textShadow = 'none';

    const luminanceLabelId = currentSelection.shadeLuminanceLabel;

    document.getElementById(luminanceLabelId).style.fontWeight = '100';
    document.getElementById(luminanceLabelId).style.color = 'black';
    document.getElementById(luminanceLabelId).style.textShadow = 'none';
  };

const /* ********************************************* */
  markSelectedShadeLabels = function (blobColor) {
    const saturationLabelId = `v${getBlobColorData(blobColor).saturation}`;

    document.getElementById(saturationLabelId).style.fontWeight = '900';
    document.getElementById(saturationLabelId).style.textShadow =
      '0px 0px 10px hsl(270, 100%, 50%)';
    document.getElementById(saturationLabelId).style.color =
      'hsl(270, 100%, 50%)';

    currentSelection.shadeSaturationLabel = saturationLabelId;

    const luminanceLabelId = `h${getBlobColorData(blobColor).luminance}`;

    document.getElementById(luminanceLabelId).style.fontWeight = '900';
    document.getElementById(luminanceLabelId).style.textShadow =
      '0px 0px 10px hsl(270, 100%, 50%)';
    document.getElementById(luminanceLabelId).style.color =
      'hsl(270, 100%, 50%)';

    currentSelection.shadeLuminanceLabel = luminanceLabelId;
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
  const clickedElementsId = event.target.id.toLowerCase();

  main(clickedElementsId);
});

/* #############################################
     developer notes
   ############################################# */

// change blob cursor color based on blob's color for better contrast

/* #############################################
     HIGHLIGHT TAGS & SNIPPETS
   ############################################# */

// background-color

// console.log

// :REFACTOR: /ref

// :HIGHLIGHT: /hig

// :DELETE: /del

// :FIX: /fix

// :DEBUG: /dev

// :TODO: /tod

// :DOING: /doi

// :OK: /ok

// :BUG: /bug

// :NOTE: /not
