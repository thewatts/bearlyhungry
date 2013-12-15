require './spec/spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "Guest User" do

  before do
    @restaurant = FactoryGirl.create(:restaurant)
    @item = FactoryGirl.create(:item, :title => "Item 1", 
                                      :restaurant => @restaurant)
  end

  it "can review order and see 'continue as guest button'" do
    page.visit restaurant_menu_path(@restaurant.slug)
    expect(page).to have_content @item.title
    click_on 'Add to Cart'
    click_on 'Checkout'
    expect(page.current_path).to eq(restaurant_review_order_path(@restaurant.slug))
    
    expect(page).to have_button "Checkout as Guest"
  end

  it "can checkout as a guest user" do
    page.visit restaurant_menu_path(@restaurant.slug)
    expect(page).to have_content @item.title
    click_on 'Add to Cart'
    click_on 'Checkout'
    fill_in 'guest-name',         with: 'Test User'
    fill_in 'guest-email',        with: 'test@example.com'
    fill_in 'guest-phone-number', with: '1234567890'
    click_on 'Checkout as Guest'
    expect(page.current_path).to eq(restaurant_review_order_path(@restaurant.slug))
  end

  it "it can register as user from order confirmation page" do
    page.visit restaurant_menu_path(@restaurant.slug)
    expect(page).to have_content @item.title
    click_on 'Add to Cart'
    click_on 'Checkout'
    fill_in 'guest-name',         with: 'Test User'
    fill_in 'guest-email',        with: 'test@example.com'
    fill_in 'guest-phone-number', with: '1234567890'
    click_on 'Checkout as Guest'
    expect(page.current_path).to eq(restaurant_review_order_path(@restaurant.slug))
  end
end
