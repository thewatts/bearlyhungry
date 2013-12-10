require 'spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "User Checkout" do

  before do
     @item = FactoryGirl.create(:item, title: "Test Item")
     @user = FactoryGirl.create(:user)
     #@item = Item.create(title: "Test Item", price: 20.00, description: "asdf")
  end

  context "with items in cart and not logged in" do
    xit "prompts to login", js: true do
      visit menu_path
      click_on "Add to Cart"
      find("#nav-order").click
      click_on "Checkout"
      expect(page).to have_content "Review Your Order:"
    end
  end

  describe "as guest" do
    context "with items in cart" do
      it "proceeds to checkout", js: true do
        visit menu_path
        click_on "Add to Cart"
        find("#nav-order").click
        click_on "Checkout"
        expect(page).to have_content "Review Your Order:"

        click_on "Continue as Guest"
        fill_in "guest-name", with: "Guest User"
        fill_in "guest-email", with: "example@example.com"
        fill_in "guest-phone-number", with: "123-123-1234"
        click_on "guest-signup-submit"
        expect(page.current_path).to eq(order_payment_path)

        click_on "Pay with Card"
        within_frame('stripe_checkout_app') do
          fill_in "email", with: "example@example.com"
          fill_in "card_number", with: "4242424242424242"
          fill_in "cc-exp", with: "1014"
          fill_in "cc-csc", with: "123"
          find("button").click
        end
        sleep 2
        expect(page).to have_content "Thanks!"
      end
    end
  end
end
