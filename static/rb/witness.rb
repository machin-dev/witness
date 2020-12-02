require_relative 'firebase.rb'

class Witness
    attr_accessor :source

    def initialize(source, params)
        @source = source
        @firebase = FirebaseController.new(*params)
    end

    def document(collection, tags = [], title, content)
        @firebase.add(collection, {
            :source => source,
            :tags => tags,
            :title => title,
            :content => content
        })
    end

    def retreive(path)
        return @firebase.collection(path)
    end
end

params = ['machin-dev', 'https://machin-dev.firebaseio.com', './static/key.json']
witness = Witness.new('ruby-test', params)

str = [
    "#This is a test",
    "```ruby",
    "class Test",
    "  attr_accessor :data",
    "",
    "  def initialize(a, b, c)",
    "    @data = [a, b, c]",
    "  end",
    "end",
    "```",
    "",
    "| Server Name | Addresses | IP 1 | IP 2 |",
    "| :---: | :---: | :---: | :---: |",
    "| myServer | 10.1.2.3 | 10.2.3.4 | 10.3.4.5 |"
]

witness.document('documents', ['test'], 'markdown test 3', str.join("\\n"))

puts witness.retreive('documents').inspect