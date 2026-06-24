(ns app.ui)

(defn alert-flash!
  "Briefly flashes the header background to signal feedback."
  []
  (when-let [el (.querySelector js/document "header")]
    (set! (.. el -style -background) "#e74c3c")
    (js/setTimeout #(set! (.. el -style -background) "") 300)))
