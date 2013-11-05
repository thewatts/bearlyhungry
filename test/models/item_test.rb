require 'test_helper'

class ItemTest < ActiveSupport::TestCase

  test "title must exist" do
    item = FactoryGirl.build(:item, title: "")
    refute item.save
  end

  test "title must be unique" do
    item1 = FactoryGirl.create(:item)
    item2 = FactoryGirl.build(:item, title: item1.title)

    refute item2.save, "Item shouldn't have saved with dup title"
  end

  test "description cannot be empty string" do
    item = FactoryGirl.build(:item, description: "")
    refute item.save
  end

  test "price needs to exist as number greater than 0.00" do
    item1 = FactoryGirl.build(:item, price: nil)
    item2 = FactoryGirl.build(:item, price: "FREE")
    item3 = FactoryGirl.build(:item, price: 0.00)
    item4 = FactoryGirl.build(:item, price: 1.00)

    refute item1.save
    refute item2.save
    refute item3.save
    assert item4.save
  end

  test "image can be added" do
    item = FactoryGirl.create(:item)
    item.image = fixture_file_upload('avatar.png', 'image/png')
    assert_equal 'avatar.png', item.image_file_name
  end
end
