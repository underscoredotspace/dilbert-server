package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	http.HandleFunc("/", imageHandler)
	log.Fatal(http.ListenAndServe(":3001", nil))
}

func imageHandler(w http.ResponseWriter, r *http.Request) {
	filename := r.URL.String()

	files, err := filepath.Glob(filename + "*")
	if err != nil || len(files) == 0 {
		log.Println("glob", err)
		http.Error(w, "Not Found", 404)
		return
	}

	filename = files[0]

	imageFile, err := os.Open(filename)
	if err != nil {
		log.Println("open", err)
		http.Error(w, "Issue opening file", 500)
		return
	}

	fileByte, err := ioutil.ReadAll(imageFile)
	if err != nil {
		log.Println("read", err)
		http.Error(w, "Issue reading file", 500)
		return
	}

	w.Write(fileByte)
}
