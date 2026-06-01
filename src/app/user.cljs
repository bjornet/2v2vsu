(ns app.user
  (:require [app.db :as db]
            [reagent.core :as r]))

(defn- next-id [users]
  (inc (apply max 0 (map :id users))))

(defn add-user! [name]
  (let [name (clojure.string/trim name)]
    (when (seq name)
      (swap! db/app-state update :users conj
             {:id (next-id (:users @db/app-state)) :name name}))))

(defn edit-user! [id name]
  (let [name (clojure.string/trim name)]
    (when (seq name)
      (swap! db/app-state update :users
             (fn [users] (mapv #(if (= (:id %) id) (assoc % :name name) %) users))))))

(defn user-section [on-generate]
  (let [new-name (r/atom "")]
    (fn []
      (let [users    (:users @db/app-state)
            can-gen? (>= (count users) 4)]
        [:section.page-wrapper
         [:h2 "Players"]
         (for [{:keys [id name]} users]
           [:div.user-wrapper {:key id}
            [:input {:type         "text"
                     :default-value name
                     :on-blur      #(edit-user! id (.. % -target -value))}]
            [:button {:on-click #(edit-user! id
                                             (.. % -target -previousSibling -value))}
             "Save"]])
         [:div.user-wrapper
          [:input {:type        "text"
                   :placeholder "Add player…"
                   :value       @new-name
                   :on-change   #(reset! new-name (.. % -target -value))
                   :on-key-down #(when (= (.-key %) "Enter")
                                   (add-user! @new-name)
                                   (reset! new-name ""))}]
          [:button {:on-click #(do (add-user! @new-name) (reset! new-name ""))}
           "Add"]]
         [:button {:disabled (not can-gen?)
                   :on-click on-generate
                   :class (when can-gen? "active")}
          "GENERATE TEAMS and FIXTURES"]]))))
