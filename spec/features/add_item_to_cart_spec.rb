require 'spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "Adding an Item to the Cart" do

  before do
    @restaurant = FactoryGirl.create(:restaurant)
    @item = FactoryGirl.create(:item, title: "Item 1", restaurant: @restaurant)
  end

  it "can add an item to the cart" do
    page.visit restaurant_menu_path(@restaurant.slug)
    within '.main-nav' do
      expect(page).to have_content "0 items"
    end
    click_on 'Add to Cart'

    within '.main-nav' do
      expect(page).to have_content "1 items"
    end
    expect(page).to have_content "Added #{@item.title} to cart."
  end

end
