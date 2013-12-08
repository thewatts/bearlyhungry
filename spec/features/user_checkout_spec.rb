require 'spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "User Checkout" do

  before do
     @item = FactoryGirl.create(:item, title: "Test Item")
     @user = FactoryGirl.create(:user)
  end

  context "with items in cart and not logged in" do
    it "prompts to login" do
      visit menu_path
      click_on "Add to Cart"
      click_on "Checkout"
      expect(page).to have_content "Review Your Order:"
    end
  end

  context "with items in cart and are logged in" do
    it "proceeds to checkout" do
      visit menu_path
      fill_in 'login-email',    with: 'asdf@asdf.com'
      fill_in 'login-password', with: 'password'
      click_on 'login-submit'
      expect(page).to have_content "Logout"
      click_on "Add to Cart"
      click_on "Checkout"
      expect(page).not_to have_content "You must login or sign up before paying."
      expect(page).to have_content "Review Your Order"
      expect(page.current_path).to eq(review_order_path)
    end
  end
end
