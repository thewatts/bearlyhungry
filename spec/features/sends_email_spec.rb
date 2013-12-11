require './spec/spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "User Mail" do
  # before(:each) do
  #   ActionMailer::Base.delivery_method = :test
  #   ActionMailer::Base.perform_deliveries = true
  #   ActionMailer::Base.deliveries = []
  #   I18n.enforce_available_locales = false
  # end

  it "should send welcoming email" do
    visit menu_path
    first(:link, "Login").click
     within('#exampleModal') do
      click_on "Signup"
      fill_in "full-name", :with => "Pho King"
      fill_in "display_name", :with => "Phoking"
      fill_in "email-address", :with => "phoking@sob.com"
      fill_in "password", :with => "password"
      fill_in "password-confirmation", :with => "password"
    end
    click_on "Signup!"
    expect(ActionMailer::Base.deliveries.last.subject).to eq("Welcome to Bearly Hungry")
  end
end
