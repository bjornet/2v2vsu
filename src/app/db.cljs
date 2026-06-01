(ns app.db
  (:require [reagent.core :as r]))

(def app-state
  (r/atom {:users [] :teams [] :fixtures []}))

(defn- ->json [v] (.stringify js/JSON (clj->js v)))
(defn- <-json [s] (js->clj (.parse js/JSON s) :keywordize-keys true))

(defn persist! [state]
  (.setItem js/localStorage "users"    (->json (:users state)))
  (.setItem js/localStorage "teams"    (->json (:teams state)))
  (.setItem js/localStorage "fixtures" (->json (:fixtures state))))

(defn init-db! []
  (let [read (fn [k] (when-let [s (.getItem js/localStorage k)]
                       (<-json s)))]
    (reset! app-state
            {:users    (or (read "users")    [])
             :teams    (or (read "teams")    [])
             :fixtures (or (read "fixtures") [])}))
  (add-watch app-state :persist
             (fn [_ _ _ new-state] (persist! new-state))))

(defn reset-db! []
  (.removeItem js/localStorage "users")
  (.removeItem js/localStorage "teams")
  (.removeItem js/localStorage "fixtures")
  (reset! app-state {:users [] :teams [] :fixtures []}))
