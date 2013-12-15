require './spec/spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "User Checkout" do

  before do
     @restaurant = FactoryGirl.create(:restaurant)
     @item = FactoryGirl.create(:item, title: "Test Item",
                                       restaurant_id: @restaurant.id)
     @user = FactoryGirl.create(:user)
     #@item = Item.create(title: "Test Item", price: 20.00, description: "asdf")
  end

  describe "for an Active User Account" do
    it "should redirect back to the review order page after logging in" do
      visit restaurant_menu_path(@restaurant.slug)
      click_on "Add to Cart"
      click_on "Checkout"
      within "#login2Tab" do
        fill_in "login-email", with: @user.email
        fill_in "login-password", with: "password"
        click_on "Login"
      end
      expect(page.current_path).to eq(review_order_path)
    end
  end

  context "with items in cart and not logged in" do
    xit "prompts to login", js: true do
      visit restaurant_menu_path(@restaurant.slug)
      click_on "Add to Cart"
      find("#nav-order").click
      click_on "Checkout"
      expect(page).to have_content "Review Your Order:"
    end
  end

  describe "as guest" do
    context "with items in cart" do
      xit "proceeds to checkout", js: true do
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
        expect(page.current_path).to eq(review_order_path)

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
        expect(ActionMailer::Base.deliveries.last.subject).to eq("Thank you for your order from Bearly Hungry")
        expect(page.current_path).to eq(order_confirmation_path)
        expect(page).to have_content "Register Account"
      end
    end

    xit "registers guest account", js: true do
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
      expect(page.current_path).to eq(review_order_path)

      click_on "Pay with Card"
      within_frame('stripe_checkout_app') do
        fill_in "email", with: "example@example.com"
        fill_in "card_number", with: "4242424242424242"
        fill_in "cc-exp", with: "1014"
        fill_in "cc-csc", with: "123"
        find("button").click
      end
      sleep 2
      fill_in "password", with: "asdf"
      fill_in "password-confirmation", with: "asdf"
      click_on "signup-submit"
      expect(page.current_path).to eq(order_confirmation_path)
      expect(page).to have_content "Your account has been created!"
    end

    xit "doesnt register guest account if pw and pw_confirmation don't match", js: true do
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
      expect(page.current_path).to eq(review_order_path)

      click_on "Pay with Card"
      within_frame('stripe_checkout_app') do
        fill_in "email", with: "example@example.com"
        fill_in "card_number", with: "4242424242424242"
        fill_in "cc-exp", with: "1014"
        fill_in "cc-csc", with: "123"
        find("button").click
      end
      sleep 10
      fill_in "password", with: "asdf"
      fill_in "password-confirmation", with: "fdsa"
      click_on "signup-submit"
      expect(page.current_path).to eq(order_confirmation_path)
      expect(page).to have_content "Password and Password Confirmation must match"
    end
  end
end
