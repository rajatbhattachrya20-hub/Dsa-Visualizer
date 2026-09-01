// ===== ALGORITHM DATA — Metadata, complexity, code snippets =====

export const ALGORITHMS = [
  // Sorting
  { id: 'bubble-sort', name: 'Bubble Sort', category: 'Sorting', page: 'sorting', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  { id: 'selection-sort', name: 'Selection Sort', category: 'Sorting', page: 'sorting', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false },
  { id: 'insertion-sort', name: 'Insertion Sort', category: 'Sorting', page: 'sorting', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  { id: 'merge-sort', name: 'Merge Sort', category: 'Sorting', page: 'sorting', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true },
  { id: 'quick-sort', name: 'Quick Sort', category: 'Sorting', page: 'sorting', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false },
  { id: 'heap-sort', name: 'Heap Sort', category: 'Sorting', page: 'sorting', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false },
  // Searching
  { id: 'linear-search', name: 'Linear Search', category: 'Searching', page: 'searching', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', stable: null },
  { id: 'binary-search', name: 'Binary Search', category: 'Searching', page: 'searching', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)', stable: null },
  // Graph
  { id: 'bfs', name: 'BFS', category: 'Graphs', page: 'graphs', best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)', stable: null },
  { id: 'dfs', name: 'DFS', category: 'Graphs', page: 'graphs', best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)', stable: null },
  { id: 'dijkstra', name: "Dijkstra's", category: 'Graphs', page: 'graphs', best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', space: 'O(V)', stable: null },
  // Tree
  { id: 'inorder', name: 'Inorder Traversal', category: 'Trees', page: 'trees', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)', stable: null },
  { id: 'preorder', name: 'Preorder Traversal', category: 'Trees', page: 'trees', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)', stable: null },
  { id: 'postorder', name: 'Postorder Traversal', category: 'Trees', page: 'trees', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)', stable: null },
];

export const CODE_SNIPPETS = {
  'bubble-sort': {
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        // Early termination if no swaps
        if (!swapped) break;
    }
}`,
    js: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`
  },
  'selection-sort': {
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx])
                minIdx = j;
        swap(arr[minIdx], arr[i]);
    }
}`,
    js: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
  },
  'insertion-sort': {
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    js: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
  },
  'merge-sort': {
    cpp: `void merge(int arr[], int l, int m, int r) {
    int n1 = m-l+1, n2 = r-m;
    vector<int> L(arr+l, arr+l+n1);
    vector<int> R(arr+m+1, arr+m+1+n2);
    int i=0, j=0, k=l;
    while (i<n1 && j<n2)
        arr[k++] = (L[i]<=R[j]) ? L[i++] : R[j++];
    while (i<n1) arr[k++]=L[i++];
    while (j<n2) arr[k++]=R[j++];
}
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l+(r-l)/2;
        mergeSort(arr, l, m);
        mergeSort(arr, m+1, r);
        merge(arr, l, m, r);
    }
}`,
    js: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}
function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length)
        result.push(left[i] <= right[j] ? left[i++] : right[j++]);
    return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`
  },
  'quick-sort': {
    cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] < pivot)
            swap(arr[++i], arr[j]);
    swap(arr[i+1], arr[high]);
    return i + 1;
}
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    js: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}
function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++)
        if (arr[j] < pivot) [arr[++i], arr[j]] = [arr[j], arr[i]];
    [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
    return i + 1;
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot, i = arr[high], low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`
  },
  'heap-sort': {
    cpp: `void heapify(int arr[], int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l<n && arr[l]>arr[largest]) largest=l;
    if (r<n && arr[r]>arr[largest]) largest=r;
    if (largest!=i) { swap(arr[i],arr[largest]); heapify(arr,n,largest); }
}
void heapSort(int arr[], int n) {
    for (int i=n/2-1; i>=0; i--) heapify(arr,n,i);
    for (int i=n-1; i>0; i--) { swap(arr[0],arr[i]); heapify(arr,i,0); }
}`,
    js: `function heapSort(arr) {
    const n = arr.length;
    for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(arr, n, i);
    for (let i = n-1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    return arr;
}
function heapify(arr, n, i) {
    let largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) { [arr[i], arr[largest]] = [arr[largest], arr[i]]; heapify(arr, n, largest); }
}`,
    python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n//2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest, l, r = i, 2*i+1, 2*i+2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`
  },
  'linear-search': {
    cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (arr[i] == target) return i;
    return -1;
}`,
    js: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++)
        if (arr[i] === target) return i;
    return -1;
}`,
    python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1`
  },
  'binary-search': {
    cpp: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    js: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
  }
};

export const ALGO_INFO = {
  'bubble-sort': {
    what: 'Bubble Sort is one of the simplest sorting algorithms. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    how: ['Start from the first element.', 'Compare adjacent elements — if left > right, swap them.', 'After one pass, the largest element "bubbles up" to its correct position at the end.', 'Repeat for remaining unsorted elements.', 'Stop early if no swaps occur in a pass (already sorted).'],
    pseudocode: `for i from 0 to n-1:
  swapped = false
  for j from 0 to n-i-2:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
      swapped = true
  if not swapped: break`
  },
  'selection-sort': {
    what: 'Selection Sort divides the array into a sorted and an unsorted region. It repeatedly finds the minimum element from the unsorted region and moves it to the beginning of the sorted region.',
    how: ['Find the minimum element in the unsorted region [i..n-1].', 'Swap it with the element at position i.', 'Expand the sorted region by one.', 'Repeat until the entire array is sorted.'],
    pseudocode: `for i from 0 to n-2:
  minIdx = i
  for j from i+1 to n-1:
    if arr[j] < arr[minIdx]:
      minIdx = j
  swap(arr[i], arr[minIdx])`
  },
  'insertion-sort': {
    what: 'Insertion Sort builds the sorted array one element at a time. It takes one element at a time and inserts it into the correct position among the already-sorted elements.',
    how: ['Start with the second element (index 1). The first element is trivially sorted.', 'Save the current element as key.', 'Shift all elements in the sorted region that are greater than key to the right.', 'Insert key at the correct position.', 'Repeat for all remaining elements.'],
    pseudocode: `for i from 1 to n-1:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`
  },
  'merge-sort': {
    what: 'Merge Sort is a divide-and-conquer algorithm. It recursively splits the array in half, sorts each half, then merges the two sorted halves back together.',
    how: ['If the array has 0 or 1 elements, it is already sorted (base case).', 'Divide the array into two halves.', 'Recursively sort the left half.', 'Recursively sort the right half.', 'Merge the two sorted halves into one sorted array.'],
    pseudocode: `function mergeSort(arr, l, r):
  if l >= r: return
  mid = (l + r) / 2
  mergeSort(arr, l, mid)
  mergeSort(arr, mid+1, r)
  merge(arr, l, mid, r)`
  },
  'quick-sort': {
    what: 'Quick Sort is a highly efficient divide-and-conquer sorting algorithm. It selects a pivot element and partitions the array into elements less than the pivot and elements greater than the pivot.',
    how: ['Choose a pivot element (last element in this implementation).', 'Partition: place all elements < pivot on the left, all elements ≥ pivot on the right.', 'Recursively sort the left partition.', 'Recursively sort the right partition.', 'Base case: arrays of size 0 or 1 are already sorted.'],
    pseudocode: `function quickSort(arr, low, high):
  if low < high:
    pi = partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)`
  },
  'heap-sort': {
    what: 'Heap Sort uses a binary heap data structure to sort elements. It first builds a max-heap from the array, then repeatedly extracts the maximum element and rebuilds the heap.',
    how: ['Build a max-heap from the input array.', 'The root of the max-heap is the largest element.', 'Swap the root with the last element; reduce heap size by 1.', 'Heapify the root to restore the max-heap property.', 'Repeat until the heap has one element.'],
    pseudocode: `buildMaxHeap(arr)
for i from n-1 to 1:
  swap(arr[0], arr[i])
  heapSize = heapSize - 1
  heapify(arr, 0, heapSize)`
  },
  'linear-search': {
    what: 'Linear Search is the simplest searching algorithm. It checks every element in the array one by one until it finds the target or reaches the end.',
    how: ['Start from the first element (index 0).', 'Compare the current element with the target.', 'If they match, return the current index.', 'If not, move to the next element.', 'If the end is reached without a match, return -1.'],
    pseudocode: `for i from 0 to n-1:
  if arr[i] == target:
    return i
return -1`
  },
  'binary-search': {
    what: 'Binary Search is a fast searching algorithm that works on sorted arrays. It repeatedly divides the search space in half, eliminating the half that cannot contain the target.',
    how: ['Set left=0 and right=n-1.', 'Calculate mid = (left+right)/2.', 'If arr[mid] == target, return mid (found!).', 'If arr[mid] < target, search the right half: left = mid+1.', 'If arr[mid] > target, search the left half: right = mid-1.', 'If left > right, the target is not in the array.'],
    pseudocode: `left = 0, right = n-1
while left <= right:
  mid = (left + right) / 2
  if arr[mid] == target: return mid
  elif arr[mid] < target: left = mid + 1
  else: right = mid - 1
return -1`
  }
};
