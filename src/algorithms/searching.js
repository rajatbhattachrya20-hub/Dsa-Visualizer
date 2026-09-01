// ===== SEARCHING ALGORITHMS — STEP GENERATORS =====

export function linearSearchSteps(arr, target) {
  const steps = [];
  const n = arr.length;

  steps.push({ checking: -1, found: -1, eliminated: [], label: `Starting Linear Search for target = ${target}` });

  for (let i = 0; i < n; i++) {
    steps.push({ checking: i, found: -1, eliminated: Array.from({length: i}, (_, k) => k), label: `Check arr[${i}] = ${arr[i]}${arr[i] === target ? ' — MATCH!' : ` ≠ ${target}, move on`}` });
    if (arr[i] === target) {
      steps.push({ checking: -1, found: i, eliminated: Array.from({length: i}, (_, k) => k), label: `✓ Target ${target} found at index ${i}!` });
      return { steps, found: true, index: i };
    }
  }

  steps.push({ checking: -1, found: -1, eliminated: Array.from({length: n}, (_, k) => k), label: `✗ Target ${target} not found in the array.` });
  return { steps, found: false, index: -1 };
}

export function binarySearchSteps(arr, target) {
  const steps = [];
  const sorted = [...arr].sort((a, b) => a - b);
  let left = 0, right = sorted.length - 1;

  steps.push({ left, right, mid: -1, checking: -1, found: -1, eliminated: [], label: `Binary Search for ${target} — array must be sorted. L=0, R=${right}` });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const eliminated = [
      ...Array.from({length: left}, (_, k) => k),
      ...Array.from({length: sorted.length - right - 1}, (_, k) => right + 1 + k)
    ];

    steps.push({ left, right, mid, checking: mid, found: -1, eliminated, label: `L=${left}, R=${right} → mid = ${mid}, arr[mid]=${sorted[mid]}` });

    if (sorted[mid] === target) {
      steps.push({ left, right, mid, checking: -1, found: mid, eliminated, label: `✓ Target ${target} found at index ${mid}!` });
      return { steps, found: true, index: mid, sortedArr: sorted };
    } else if (sorted[mid] < target) {
      steps.push({ left, right, mid, checking: mid, found: -1, eliminated, label: `arr[mid]=${sorted[mid]} < ${target} → search RIGHT half, L = ${mid+1}` });
      left = mid + 1;
    } else {
      steps.push({ left, right, mid, checking: mid, found: -1, eliminated, label: `arr[mid]=${sorted[mid]} > ${target} → search LEFT half, R = ${mid-1}` });
      right = mid - 1;
    }
  }

  steps.push({ left, right, mid: -1, checking: -1, found: -1, eliminated: Array.from({length: sorted.length}, (_, k) => k), label: `✗ Target ${target} not found in the array.` });
  return { steps, found: false, index: -1, sortedArr: sorted };
}
