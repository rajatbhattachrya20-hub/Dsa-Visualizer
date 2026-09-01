// ===== SORTING ALGORITHMS — STEP GENERATORS =====
// Each function returns an array of "steps":
// { array: [...], highlight: {comparing:[i,j], swapping:[i,j], sorted:[...], pivot:k}, label: "..." }

export function bubbleSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const sorted = new Set();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...arr], highlight: { comparing: [j, j+1], sorted: [...sorted] }, label: `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}` });
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swapped = true;
        steps.push({ array: [...arr], highlight: { swapping: [j, j+1], sorted: [...sorted] }, label: `Swapping ${arr[j+1]} and ${arr[j]} (arr[${j}]↔arr[${j+1}])` });
      }
    }
    sorted.add(n - 1 - i);
    steps.push({ array: [...arr], highlight: { sorted: [...sorted] }, label: `Element ${arr[n-1-i]} is now in its correct position (index ${n-1-i})` });
    if (!swapped) {
      for (let k = 0; k < n - 1 - i; k++) sorted.add(k);
      steps.push({ array: [...arr], highlight: { sorted: [...sorted] }, label: 'Array is already sorted — early termination' });
      break;
    }
  }
  sorted.add(0);
  steps.push({ array: [...arr], highlight: { sorted: [...new Array(n).keys()] }, label: 'Array is fully sorted! ✓' });
  return steps;
}

export function selectionSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const sorted = new Set();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({ array: [...arr], highlight: { selected: [i], sorted: [...sorted] }, label: `Assume arr[${i}]=${arr[i]} is minimum` });
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...arr], highlight: { comparing: [minIdx, j], selected: [i], sorted: [...sorted] }, label: `Compare minimum ${arr[minIdx]} with arr[${j}]=${arr[j]}` });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({ array: [...arr], highlight: { selected: [minIdx, i], sorted: [...sorted] }, label: `New minimum found: ${arr[minIdx]} at index ${minIdx}` });
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({ array: [...arr], highlight: { swapping: [i, minIdx], sorted: [...sorted] }, label: `Swap minimum ${arr[i]} to position ${i}` });
    }
    sorted.add(i);
    steps.push({ array: [...arr], highlight: { sorted: [...sorted] }, label: `Position ${i} is now sorted with value ${arr[i]}` });
  }
  sorted.add(n - 1);
  steps.push({ array: [...arr], highlight: { sorted: [...new Array(n).keys()] }, label: 'Array is fully sorted! ✓' });
  return steps;
}

export function insertionSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const sorted = new Set([0]);
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    steps.push({ array: [...arr], highlight: { selected: [i], sorted: [...sorted] }, label: `Pick key = arr[${i}] = ${key}` });
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      steps.push({ array: [...arr], highlight: { comparing: [j, j+1], sorted: [...sorted] }, label: `arr[${j}]=${arr[j]} > key=${key}, shift right` });
      arr[j+1] = arr[j];
      steps.push({ array: [...arr], highlight: { swapping: [j, j+1], sorted: [...sorted] }, label: `Shift ${arr[j]} from index ${j} to ${j+1}` });
      j--;
    }
    arr[j+1] = key;
    sorted.add(i);
    steps.push({ array: [...arr], highlight: { sorted: [...sorted] }, label: `Insert key=${key} at index ${j+1}` });
  }
  steps.push({ array: [...arr], highlight: { sorted: [...new Array(n).keys()] }, label: 'Array is fully sorted! ✓' });
  return steps;
}

export function mergeSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const sorted = new Set();

  function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    steps.push({ array: [...arr], highlight: { selected: Array.from({length: right-left+1}, (_,x)=>left+x), sorted: [...sorted] }, label: `Merging subarrays [${left}..${mid}] and [${mid+1}..${right}]` });

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ array: [...arr], highlight: { comparing: [left+i, mid+1+j], sorted: [...sorted] }, label: `Compare ${leftArr[i]} (L) vs ${rightArr[j]} (R)` });
      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++];
      } else {
        arr[k++] = rightArr[j++];
      }
      steps.push({ array: [...arr], highlight: { sorted: [...sorted] }, label: `Place ${arr[k-1]} at index ${k-1}` });
    }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; }

    for (let x = left; x <= right; x++) sorted.add(x);
    steps.push({ array: [...arr], highlight: { sorted: [...sorted] }, label: `Subarray [${left}..${right}] merged` });
  }

  function mergeSort(arr, left, right) {
    if (left >= right) {
      sorted.add(left);
      return;
    }
    const mid = Math.floor((left + right) / 2);
    steps.push({ array: [...arr], highlight: { selected: Array.from({length: right-left+1}, (_,x)=>left+x), sorted: [...sorted] }, label: `Divide [${left}..${right}] at mid=${mid}` });
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  mergeSort(arr, 0, arr.length - 1);
  steps.push({ array: [...arr], highlight: { sorted: [...new Array(arr.length).keys()] }, label: 'Array is fully sorted! ✓' });
  return steps;
}

export function quickSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const sorted = new Set();

  function partition(arr, low, high) {
    const pivot = arr[high];
    steps.push({ array: [...arr], highlight: { pivot: high, selected: Array.from({length: high-low+1}, (_,x)=>low+x), sorted: [...sorted] }, label: `Pivot = ${pivot} (index ${high})` });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ array: [...arr], highlight: { comparing: [j, high], pivot: high, sorted: [...sorted] }, label: `Compare arr[${j}]=${arr[j]} with pivot=${pivot}` });
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ array: [...arr], highlight: { swapping: [i, j], pivot: high, sorted: [...sorted] }, label: `arr[${j}]=${arr[j]} < pivot=${pivot}, swap with arr[${i}]` });
      }
    }
    [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
    sorted.add(i + 1);
    steps.push({ array: [...arr], highlight: { sorted: [...sorted], pivot: i+1 }, label: `Pivot ${pivot} placed at correct position ${i+1}` });
    return i + 1;
  }

  function quickSort(arr, low, high) {
    if (low >= high) {
      if (low === high) sorted.add(low);
      return;
    }
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }

  quickSort(arr, 0, arr.length - 1);
  steps.push({ array: [...arr], highlight: { sorted: [...new Array(arr.length).keys()] }, label: 'Array is fully sorted! ✓' });
  return steps;
}

export function heapSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const sorted = new Set();
  const n = arr.length;

  function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({ array: [...arr], highlight: { comparing: [largest, left], sorted: [...sorted] }, label: `Compare parent arr[${largest}]=${arr[largest]} with left child arr[${left}]=${arr[left]}` });
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < n) {
      steps.push({ array: [...arr], highlight: { comparing: [largest, right], sorted: [...sorted] }, label: `Compare arr[${largest}]=${arr[largest]} with right child arr[${right}]=${arr[right]}` });
      if (arr[right] > arr[largest]) largest = right;
    }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({ array: [...arr], highlight: { swapping: [i, largest], sorted: [...sorted] }, label: `Swap arr[${i}]=${arr[largest]} and arr[${largest}]=${arr[i]}` });
      heapify(arr, n, largest);
    }
  }

  // Build max heap
  steps.push({ array: [...arr], highlight: { sorted: [] }, label: 'Building max-heap...' });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  steps.push({ array: [...arr], highlight: { selected: [...new Array(n).keys()], sorted: [] }, label: 'Max-heap built! Root is largest element.' });

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sorted.add(i);
    steps.push({ array: [...arr], highlight: { swapping: [0, i], sorted: [...sorted] }, label: `Move max ${arr[i]} to position ${i}` });
    heapify(arr, i, 0);
  }
  sorted.add(0);
  steps.push({ array: [...arr], highlight: { sorted: [...new Array(n).keys()] }, label: 'Array is fully sorted! ✓' });
  return steps;
}
