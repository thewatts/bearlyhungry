require 'minitest/autorun'
require 'spec_helper'

class ChargesControllerTest < ActionController::TestCase
  
  setup do 
    Capybara.reset_sessions!
  end

  test "doesn't charge card unless logged in" do
    #charge card
    #create content in cart
  end

  def login_user(user)
    page.visit root_path
    fill_in "login-email", with: "test@example.com"
    fill_in "login-password", with: "password"\
    fill_in "login-password", with: "password"
  end

  test "doesn't charge card unless something is in cart" do
    user = User.create!(
      email: "test@example.com",
      password: "password",
      password_confirmation: "password",
      full_name: "user")
    @customer = FactoryGirl.create(:customer)
    

  end

  

describe "Configuring the stripe engine" do
  it "reads the api key that is set in the environment" do
    Stripe.api_base.must_equal 'http://localhost:5000'
    Stripe.api_key.must_equal 'XYZ'
    Stripe.verify_ssl_certs.must_equal false
  end
end

end
