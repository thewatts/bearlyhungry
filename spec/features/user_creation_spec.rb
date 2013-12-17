require './spec/spec_helper'
require 'capybara/rails'
require 'capybara/rspec'

describe "User Signup" do

  it "can signup a user with correct attributes" do
    page.visit root_path 
    expect(page).not_to have_content "Account"
    click_on 'Sign Up'
    within '#signupTab' do
      fill_in 'full-name',             with: 'Test User'
      fill_in 'email-address',         with: 'test@example.com'
      fill_in 'password',              with: 'password'
      fill_in 'password-confirmation', with: 'password'
      click_on 'signup-submit'
    end
    expect(page).to have_content "Logout"
  end

  it "can't signup a user with incorrect attributes" do
    page.visit root_path
    expect(page).not_to have_content "Account"
    click_on 'Sign Up'
    within '#signupTab' do
      fill_in 'full-name',             with: 'Test User'
      fill_in 'email-address',         with: 'test@example.com'
      fill_in 'password',              with: 'password'
      fill_in 'password-confirmation', with: 'NON MATCHING SUCKA?!'
      click_on 'signup-submit'
    end
    expect(page).to_not have_content "Logout"
    expect(page).to have_content
      "Password Confirmation doesn't match password"
  end

end
