require './test/test_helper'

class OrderTest < ActiveSupport::TestCase

  test "title must exist" do
    item = FactoryGirl.build(:item, title: "")
    refute item.save
  end

end
