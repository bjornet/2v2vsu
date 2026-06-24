(ns app.core
  (:require [reagent.dom :as rdom]
            [app.db :as db]
            [app.team :as team]
            [app.fixture :as fixture]
            [app.user :as user]))

(defn- generate! []
  (team/generate-teams!)
  (fixture/generate-fixtures!))

(defn- root []
  [:div
   [:header
    [:h1 "2v2 vs U"]
    [:nav
     [:button {:on-click db/reset-db!} "Reset App"]]]
   [user/user-section generate!]
   [team/team-section]
   [fixture/fixture-section]])

(defn init []
  (db/init-db!)
  (rdom/render [root] (.getElementById js/document "app")))
