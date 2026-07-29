import type { CodingQuestion } from '../types'

export const codingQuestions: CodingQuestion[] = [
  {
    id: 1,
    title: 'Next Smaller To The Right',
    category: 'Data Structures',
    difficulty: 'Medium',
    description: `Given an array of \`n\` integers, for each element find the nearest element to its right that is strictly smaller than it. If no such element exists, the answer for that position is \`-1\`.

**Input format**
- Line 1: an integer \`n\`, the size of the array.
- Line 2: \`n\` space-separated integers.

**Output format**
- A single line with \`n\` space-separated integers — the nearest smaller element to the right for each position, in order.`,
    constraints: [
      '1 <= n <= 1000',
      '-10^9 <= arr[i] <= 10^9',
    ],
    examples: [
      {
        input: '5\n4 5 2 10 8',
        output: '2 2 -1 8 -1',
        explanation:
          'For 4, the nearest smaller value to its right is 2. For 5, it is also 2. 2 has nothing smaller to its right, so -1. For 10, it is 8. For 8, nothing follows, so -1.',
      },
      {
        input: '5\n5 4 3 2 1',
        output: '4 3 2 1 -1',
        explanation: 'The array is strictly decreasing, so each element\'s immediate neighbor is its answer, except the last.',
      },
    ],
    testCases: [
      { input: '5\n4 5 2 10 8', expectedOutput: '2 2 -1 8 -1' },
      { input: '5\n1 2 3 4 5', expectedOutput: '-1 -1 -1 -1 -1' },
      { input: '5\n5 4 3 2 1', expectedOutput: '4 3 2 1 -1' },
      { input: '1\n7', expectedOutput: '-1' },
      { input: '4\n3 3 3 3', expectedOutput: '-1 -1 -1 -1' },
      { input: '6\n-2 -1 -3 0 5 -5', expectedOutput: '-3 -3 -5 -5 -5 -1' },
      { input: '6\n10 1 10 1 10 1', expectedOutput: '1 -1 1 -1 1 -1' },
      { input: '8\n100 90 95 80 85 70 75 60', expectedOutput: '90 80 80 70 70 60 60 -1' },
      { input: '8\n1 -1 1 -1 1 -1 1 -1', expectedOutput: '-1 -1 -1 -1 -1 -1 -1 -1' },
      { input: '12\n9 8 7 6 5 4 3 2 1 0 -1 0', expectedOutput: '8 7 6 5 4 3 2 1 0 -1 -1 -1' },
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        StringTokenizer tokenizer = new StringTokenizer(scanner.nextLine());
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(tokenizer.nextToken());
        }

        int[] result = new int[n];
        // TODO: for each index i, find the first arr[j] (j > i) with arr[j] < arr[i]; else -1.

        StringBuilder output = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) output.append(' ');
            output.append(result[i]);
        }
        System.out.println(output);
    }
}
`,
      python: `import sys


def main():
    data = sys.stdin.read().split('\\n')
    n = int(data[0].strip())
    arr = list(map(int, data[1].split()))

    result = [-1] * n
    # TODO: for each index i, find the first arr[j] (j > i) with arr[j] < arr[i]; else -1.

    print(' '.join(map(str, result)))


if __name__ == '__main__':
    main()
`,
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[1000];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    int result[1000];
    for (int i = 0; i < n; i++) result[i] = -1;
    // TODO: for each index i, find the first arr[j] (j > i) with arr[j] < arr[i]; else -1.

    for (int i = 0; i < n; i++) {
        printf("%d", result[i]);
        if (i + 1 < n) printf(" ");
    }
    printf("\\n");
    return 0;
}
`,
    },
  },
  {
    id: 2,
    title: 'Minimum Meeting Rooms',
    category: 'Algorithms',
    difficulty: 'Hard',
    description: `You are given \`n\` meetings, each with a start and end time. Treat each meeting as covering the half-open interval \`[start, end)\` — a meeting that ends exactly when another begins does **not** count as overlapping.

Determine the minimum number of rooms required so that every meeting can be scheduled without any two overlapping meetings sharing a room.

**Input format**
- Line 1: an integer \`n\`, the number of meetings.
- Next \`n\` lines: two space-separated integers \`start end\`.

**Output format**
- A single integer — the minimum number of rooms required.`,
    constraints: [
      '1 <= n <= 1000',
      '0 <= start < end <= 10^9',
    ],
    examples: [
      {
        input: '3\n0 30\n5 10\n15 20',
        output: '2',
        explanation:
          'Meeting [0,30) overlaps with both [5,10) and [15,20), but the latter two do not overlap each other, so 2 rooms suffice.',
      },
      {
        input: '3\n1 5\n5 10\n10 15',
        output: '1',
        explanation: 'Each meeting starts exactly when the previous one ends, so they never overlap — 1 room is enough.',
      },
    ],
    testCases: [
      { input: '3\n0 30\n5 10\n15 20', expectedOutput: '2' },
      { input: '2\n7 10\n2 4', expectedOutput: '1' },
      { input: '3\n1 5\n5 10\n10 15', expectedOutput: '1' },
      { input: '4\n1 10\n2 9\n3 8\n4 7', expectedOutput: '4' },
      { input: '1\n0 5', expectedOutput: '1' },
      { input: '4\n1 2\n1 2\n1 2\n1 2', expectedOutput: '4' },
      { input: '5\n0 100\n10 20\n20 30\n30 40\n50 60', expectedOutput: '2' },
      { input: '5\n5 6\n1 2\n3 4\n2 3\n4 5', expectedOutput: '1' },
      { input: '5\n0 10\n0 10\n0 10\n5 15\n5 15', expectedOutput: '5' },
      { input: '6\n1 3\n2 6\n8 10\n15 18\n5 9\n4 7', expectedOutput: '3' },
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            StringTokenizer tokenizer = new StringTokenizer(scanner.nextLine());
            intervals[i][0] = Integer.parseInt(tokenizer.nextToken());
            intervals[i][1] = Integer.parseInt(tokenizer.nextToken());
        }

        int result = 0;
        // TODO: compute the minimum number of rooms needed so that no two
        // overlapping meetings share a room. Treat intervals as [start, end).

        System.out.println(result);
    }
}
`,
      python: `import sys


def main():
    data = sys.stdin.read().split('\\n')
    n = int(data[0].strip())
    intervals = []
    for i in range(1, n + 1):
        start, end = map(int, data[i].split())
        intervals.append((start, end))

    result = 0
    # TODO: compute the minimum number of rooms needed so that no two
    # overlapping meetings share a room. Treat intervals as [start, end).

    print(result)


if __name__ == '__main__':
    main()
`,
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int starts[1000], ends[1000];
    for (int i = 0; i < n; i++) scanf("%d %d", &starts[i], &ends[i]);

    int result = 0;
    // TODO: compute the minimum number of rooms needed so that no two
    // overlapping meetings share a room. Treat intervals as [start, end).

    printf("%d\\n", result);
    return 0;
}
`,
    },
  },
]
