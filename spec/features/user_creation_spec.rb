require 'spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "User Signup" do

  it "can signup a user" do
    page.visit menu_path
    expect(page).not_to have_content "Account"
    within '#signupTab' do
      fill_in 'full-name', with: 'Test User'
      fill_in 'email-address', with: 'test@example.com'
      fill_in 'password', with: 'password'
      fill_in 'password-confirmation', with: 'password'
      click_on 'signup-submit'
    end
    expect(page).to have_content "Logout"
  end

end
