(ns app.team
  (:require [app.db :as db]
            [app.combinatorics :as c]))

(defn no-member-overlap? [a b]
  (empty? (clojure.set/intersection (set (:members a)) (set (:members b)))))

(defn generate-teams! []
  (let [users (:users @db/app-state)
        pairs (c/pairs users)]
    (swap! db/app-state assoc :teams
           (vec (map-indexed
                 (fn [i [a b]]
                   {:id      (inc i)
                    :name    (str "Team " (inc i))
                    :members [(:id a) (:id b)]
                    :order   (inc i)})
                 pairs)))))

(defn edit-team! [id name]
  (let [name (clojure.string/trim name)]
    (when (seq name)
      (swap! db/app-state update :teams
             (fn [teams] (mapv #(if (= (:id %) id) (assoc % :name name) %) teams))))))

(defn shuffle-teams! []
  (swap! db/app-state update :teams shuffle))

(defn- member-label [users user-id idx]
  (let [user (first (filter #(= (:id %) user-id) users))]
    [:span {:key idx :class (str "member-label member-" (inc idx))}
     (:name user)]))

(defn team-section []
  (let [teams (:teams @db/app-state)
        users (:users @db/app-state)]
    (when (seq teams)
      [:section.page-wrapper
       [:h2 "Teams"]
       [:button {:on-click shuffle-teams!} "Shuffle"]
       (for [{:keys [id name members]} teams]
         [:div.team-wrapper {:key id}
          [:input {:type          "text"
                   :default-value name
                   :on-blur       #(edit-team! id (.. % -target -value))}]
          (map-indexed (fn [idx uid] (member-label users uid idx)) members)])])))
