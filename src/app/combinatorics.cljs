(ns app.combinatorics
  (:require [clojure.math.combinatorics :as combo]))

(defn binomial [n k]
  (let [k (min k (- n k))]
    (reduce (fn [acc i] (/ (* acc (- n i)) (inc i))) 1 (range k))))

(defn pairs [coll]
  (combo/combinations coll 2))
