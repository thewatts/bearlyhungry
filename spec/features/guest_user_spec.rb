require './spec/spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "Guest User" do

  before do
    @item = FactoryGirl.create(:item, title: "Item 1")
  end

  it "can review order and see 'continue as guest button'" do
    page.visit menu_path
    expect(page).to have_content @item.title
    click_on 'Add to Cart'
    click_on 'Checkout'
    expect(page.current_path).to eq(review_order_path)
    
    expect(page).to have_button "Checkout as Guest"
  end

  it "can checkout as a guest user" do
    page.visit menu_path
    expect(page).to have_content @item.title
    click_on 'Add to Cart'
    click_on 'Checkout'
    fill_in 'guest-name',         with: 'Test User'
    fill_in 'guest-email',        with: 'test@example.com'
    fill_in 'guest-phone-number', with: '1234567890'
    click_on 'Checkout as Guest'
    expect(page.current_path).to eq(review_order_path)
  end

  it "it can register as user from order confirmation page" do
    page.visit menu_path
    expect(page).to have_content @item.title
    click_on 'Add to Cart'
    click_on 'Checkout'
    fill_in 'guest-name',         with: 'Test User'
    fill_in 'guest-email',        with: 'test@example.com'
    fill_in 'guest-phone-number', with: '1234567890'
    click_on 'Checkout as Guest'
    expect(page.current_path).to eq(review_order_path)
  end
end
