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

  # it "can't signup a user with incorrect attributes" do
  #   page.visit menu_path
  #   expect(page).not_to have_content "Account"
  #   within '#signupTab' do
  #     fill_in 'full-name',             with: 'Test User'
  #     fill_in 'email-address',         with: 'test@example.com'
  #     fill_in 'password',              with: 'password'
  #     fill_in 'password-confirmation', with: 'NON MATCHING SUCKA?!'
  #     click_on 'signup-submit'
  #   end
  #   expect(page).to_not have_content "Logout"
  #   expect(page).to have_content
  #     "Password Confirmation doesn't match password"
  # end
end
