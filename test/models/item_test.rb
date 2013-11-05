require 'test_helper'

class ItemTest < ActiveSupport::TestCase

   test "title must exist" do
    item = Item.new
    refute item.save
   end

   test "title must be unique" do
     item1 = Item.new(title: "PHO").save
     item2 = Item.new(title: "PHO")

     refute item2.save, "Item shouldn't have saved with dup title"
   end

   test "price needs to exist as number greater than 0.00" do
    item1 = Item.new(title: "PhoREAL!?")
    item2 = Item.new(title: "PHANOAM", price: "FREE")
    item3 = Item.new(title: "PHO", price: 0.00)
    item4 = Item.new(title: "PHON", price: 9.99)

    refute item1.save
    refute item2.save
    refute item3.save
    assert item4.save
   end
end