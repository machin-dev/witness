require_relative 'firebase.rb'

class Witness
    attr_accessor :source

    def initialize(source, params, author = "")
        @source, @author = source, author
        @firebase = FirebaseController.new(*params)
        @checks = []
        @results = ['Success', 'Warning', 'Failure']
    end

    def add_document(collection, tags = [], title, content)
        @firebase.add(collection, {
            :author => @author,
            :source => @source,
            :tags => tags,
            :title => title,
            :content => content
        })
    end

    def add_check(title, result, comment = "")
        @checks << {
            :title => title,
            :result => @results[result],
            :comment => comment
        }
    end

    def clear_checks
        @checks = []
    end

    def add_build(id, title, tags = [], checks = @checks)
        puts checks.inspect
        @firebase.add('builds', {
            :author => @author,
            :source => @source,
            :tags => tags,
            :title => title,
            :checks => checks
        })
        clear_checks
    end

    def retreive(path)
        return @firebase.collection(path)
    end
end

params = ['machin-dev', 'https://machin-dev.firebaseio.com', './static/key.json']
witness = Witness.new('ruby-test', params, 'Louis Machin')

#str = [
#    "#This is a test",
#    "```ruby",
#    "class Test",
#    "  attr_accessor :data",
#    "",
#    "  def initialize(a, b, c)",
#    "    @data = [a, b, c]",
#    "  end",
#    "end",
#    "```",
#    "",
#    "| Server Name | Addresses | IP 1     | IP 2     |",
#    "| :---------: | :-------: | :------: | :------: |",
#    "| myServer    | 10.1.2.3  | 10.2.3.4 | 10.3.4.5 |"
#]

#witness.document('documents', ['test'], 'markdown test 3', str.join("\\n"))

witness.add_check('Set DEBUG mode to FALSE', 0)
witness.add_check('Built executable with Ocra', 0)
witness.add_check('Copied executable to clean folder', 0)
witness.add_check('Reset config.json file', 1, 'Built to MultiMeds standard')
witness.add_check('Built MSI file', 2)
witness.add_build('test-03-12-2020', 'Test build 03/12', ['test'])