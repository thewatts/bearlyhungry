require 'spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "User Checkout" do

  before do
     #@item = FactoryGirl.create(:item, title: "Test Item")
     #@user = FactoryGirl.create(:user)
     @item = Item.create(title: "Test Item", price: 20.00, description: "asdf")
  end

  context "with items in cart and not logged in" do
    it "prompts to login", js: true do
      visit menu_path
      click_on "Add to Cart"
      find("#nav-order").click
      click_on "Checkout"
      expect(page).to have_content "Review Your Order:"
    end
  end

  context "with items in cart and are logged in" do
    it "proceeds to checkout", js: true do
      visit menu_path
      click_on "Add to Cart"
      find("#nav-order").click
      click_on "Checkout"
      expect(page).to have_content "Review Your Order:"
      click_on "Pay with Card"
      within_frame('stripe_checkout_app') do
        fill_in "email", with: "YO MAMA"
      end
    end
  end
end
