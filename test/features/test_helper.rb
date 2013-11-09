# require './test/test_helper'

# class FeatureTest < ActionController::TestCase
#   include WTPhoFeatureHelpers
# end

# module WTPhoFeatureHelpers
#   def create_item(title,description,price)
#     visit items_path

#     click_on "New Item"

#     fill_in "title", :with => title
#     fill_in "description", :with => description
#     fill_in "price", :with => price

#     click_on "Save Item"

#     # NOTE: this might not work because most tests run in a transaction
#     # Idea.last
#     # OR
#     # Find the last item just add to the index
#   end

# end
