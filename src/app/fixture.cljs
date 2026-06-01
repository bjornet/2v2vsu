(ns app.fixture
  (:require [app.db :as db]
            [app.team :as team]
            [reagent.core :as r]))

(defn generate-fixtures! []
  (let [teams (:teams @db/app-state)
        pairs (for [home teams
                    away teams
                    :when (team/no-member-overlap? home away)]
                {:home-id (:id home) :away-id (:id away)})]
    (swap! db/app-state assoc :fixtures
           (vec (map-indexed
                 (fn [i p]
                   (assoc p :id (inc i) :home-goals nil :away-goals nil))
                 pairs)))))

(defn update-fixture! [id home-goals away-goals]
  (swap! db/app-state update :fixtures
         (fn [fixtures]
           (mapv #(if (= (:id %) id)
                    (assoc % :home-goals home-goals :away-goals away-goals)
                    %)
                 fixtures))))

(defn- scoreboard []
  (let [fixtures (filter #(some? (:home-goals %)) (:fixtures @db/app-state))
        teams    (:teams @db/app-state)
        tally    (reduce (fn [acc {:keys [home-id away-id home-goals away-goals]}]
                           (let [hw (> home-goals away-goals)
                                 aw (> away-goals home-goals)]
                             (-> acc
                                 (update-in [home-id :played] (fnil inc 0))
                                 (update-in [home-id :goals]  (fnil + 0) home-goals)
                                 (update-in [home-id :points] (fnil + 0) (if hw 3 (if aw 0 1)))
                                 (update-in [away-id :played] (fnil inc 0))
                                 (update-in [away-id :goals]  (fnil + 0) away-goals)
                                 (update-in [away-id :points] (fnil + 0) (if aw 3 (if hw 0 1))))))
                         {}
                         fixtures)]
    (when (seq tally)
      [:section.page-wrapper
       [:h2 "Scoreboard"]
       [:table
        [:thead [:tr [:th "Team"] [:th "P"] [:th "Goals"] [:th "Pts"]]]
        [:tbody
         (for [{:keys [id name]} (sort-by #(- (get-in tally [(:id %) :points] 0)) teams)]
           [:tr {:key id}
            [:td name]
            [:td (get-in tally [id :played] 0)]
            [:td (get-in tally [id :goals] 0)]
            [:td (get-in tally [id :points] 0)]])]]])))

(defn fixture-section []
  (let [fixtures (:fixtures @db/app-state)
        teams    (:teams @db/app-state)]
    (when (seq fixtures)
      (let [team-name (fn [id] (:name (first (filter #(= (:id %) id) teams))))]
        [:div
         [:section.page-wrapper
          [:h2 "Fixtures"]
          (for [{:keys [id home-id away-id home-goals away-goals]} fixtures]
            (let [h-val (r/atom (or home-goals ""))
                  a-val (r/atom (or away-goals ""))]
              [:div.fixture-wrapper {:key id}
               [:span.fixture-label (team-name home-id)]
               [:input {:type      "number" :value @h-val
                        :on-change #(reset! h-val (.. % -target -value))}]
               [:span.vs-devider "vs"]
               [:input {:type      "number" :value @a-val
                        :on-change #(reset! a-val (.. % -target -value))}]
               [:span.fixture-label (team-name away-id)]
               [:button {:on-click #(update-fixture! id
                                                     (js/parseInt @h-val)
                                                     (js/parseInt @a-val))}
                "Save"]]))]
         [scoreboard]]))))
