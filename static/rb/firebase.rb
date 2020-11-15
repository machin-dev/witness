# Require gems
require 'rubygems'
require 'bundler'
Bundler.setup(:default, :ci)
require 'firebase'
require "google/cloud/firestore"

PROJECT_ID = 'machin-dev'
BASE_URI = 'https://machin-dev.firebaseio.com'
KEY_PATH = './static/key.json'
VERBOSE = true

def push_to_realtime_firebase(path, datum, project_id = PROJECT_ID, key_path = KEY_PATH, base_uri = BASE_URI)
    auth_token = File.open(key_path).read
    firebase = Firebase::Client.new(base_uri, auth_token)
    response = firebase.push(path, datum)
    puts response.success? ? "Data pushed to database" : "Data could not be pushed" if VERBOSE
    return response.success?
end

def set_to_realtime_firebase(path, datum, project_id = PROJECT_ID, key_path = KEY_PATH, base_uri = BASE_URI)
    auth_token = File.open(key_path).read
    firebase = Firebase::Client.new(base_uri, auth_token)
    response = firebase.set(path, datum)
    puts response.success? ? "Data added to database" : "Data could not be added" if VERBOSE
    return response.success?
end

def add_to_firestore(col, datum, project_id = PROJECT_ID, key_path = KEY_PATH, base_uri = BASE_URI)
    firestore = Google::Cloud::Firestore.new(project_id: project_id, credentials: key_path)
    collection = firestore.col(col)
    return collection.add(datum)
end

def set_to_firestore(col, doc, datum, project_id = PROJECT_ID, key_path = KEY_PATH, base_uri = BASE_URI)
    firestore = Google::Cloud::Firestore.new(project_id: project_id, credentials: key_path)
    document = firestore.col(col).doc(doc)
    return document.set(datum)
end

datum = { "source" => "test", "content" => "def456" }
add_to_firestore('documents', datum)