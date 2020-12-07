# Require gems
require 'rubygems'
require 'bundler'
Bundler.setup(:default, :ci)

require 'firebase'
require "google/cloud/firestore"

VERBOSE = true

class FirebaseController
    attr_accessor :project_id, :base_uri, :key_path
    def initialize(project_id, base_uri, key_path)
        @project_id = project_id
        @base_uri   = base_uri
        @key_path   = key_path
        @auth_token = File.open(@key_path).read
        @firestore  = Google::Cloud::Firestore.new(project_id: @project_id, credentials: @key_path)
    end

    def push_to_realtime(path, datum)
        firebase = Firebase::Client.new(@base_uri, @auth_token)
        response = firebase.push(path, datum)
        puts response.success? ? "Data pushed to database" : "Data could not be pushed" if VERBOSE
        return response.success?
    end

    def set_to_realtime(path, datum)
        firebase = Firebase::Client.new(@base_uri, @auth_token)
        response = firebase.set(path, datum)
        puts response.success? ? "Data added to database" : "Data could not be added" if VERBOSE
        return response.success?
    end

    def add(col, datum)
        collection = @firestore.col(col)
        return collection.add(datum)
    end
    
    def set(col, doc, datum)
        doc_ref = @firestore.col(col).doc(doc)
        return doc_ref.set(datum)
    end

    def delete(col, doc)
        doc_ref = @firestore.doc("#{col}/#{doc}")
        doc_ref.delete
    end

    def list_collections()
        result = []
        @firestore.cols { |col| result << col.collection_id }
        return result
    end

    def collection(col)
        result = {}
        col_ref = @firestore.col(col)
        col_ref.get { |doc| result[doc.document_id] = doc.data }
        return result
    end
end

#params = ['machin-dev', 'https://machin-dev.firebaseio.com', './static/key.json']
#firebase = FirebaseController.new(*params)

#puts firebase.list_collections.inspect

#firebase.collection('documents').each { |doc| puts doc.inspect }