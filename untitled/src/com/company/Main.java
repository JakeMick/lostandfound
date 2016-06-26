package com.company;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int target = sc.nextInt();
        int coins = sc.nextInt();
        allCoins = new int[coins];
        for (int i = 0; i < coins; i++) {
           allCoins[i] = sc.nextInt();
        }
        Arrays.sort(allCoins);
        long val = new Main().solve(target, allCoins.length - 1);
        System.out.println(val);
    }

    private static int[] allCoins;
    private static final Map<Tuple, Long> cache = new HashMap<>();

    public Long solve(int target, int coinInd) {
        if (target < 0 || coinInd < 0) {
            return 0L;
        }
        if (target == 0) {
            return 1L;
        }
        Tuple t = new Tuple(target, coinInd);
        if (cache.containsKey(t)) {
            return cache.get(t);
        }
        long count = solve(target, coinInd - 1) + solve(target - allCoins[coinInd], coinInd);
        System.out.println(target + " " + count);
        cache.put(t, count);
        return count;
    }

    class Tuple {
        private final int a;

        private final int b;

        Tuple(int a, int b) {
            this.a = a;
            this.b = b;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            Tuple tuple = (Tuple) o;

            return a == tuple.a && b == tuple.b;

        }

        @Override
        public int hashCode() {
            int result = a;
            result = 31 * result + b;
            return result;
        }
    }
}
