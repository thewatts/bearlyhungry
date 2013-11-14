require 'test_helper'

class CategoryTest < ActiveSupport::TestCase

  test "it responds to #items" do
    assert_respond_to FactoryGirl.create(:category), :items
  end

  test "it slugs out its title" do
    category = FactoryGirl.create(:category, title: "House Specials")
    assert_equal "house-specials", category.slug
  end

  test "it slugs out a title that has ?! type chars" do
    skip
    title = "  a Swim through LIFE  at the ? most CONVENIENT! of times :) "
    category = FactoryGirl.create(:category, title: title)
    desired_result = "a-swim-through-life-at-the-most-convenient-of-times"
    assert_equal desired_result, category.slug
  end

  test "it can find by slug" do
    category1 = FactoryGirl.create(:category, title: "House Specials")
    category2 = FactoryGirl.create(:category, title: "Chicken")
    assert_equal category1, Category.find_by_slug('house-specials')
    assert_equal category2, Category.find_by_slug('chicken')
  end

end
