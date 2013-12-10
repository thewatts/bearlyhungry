require './spec/spec_helper'

describe User do
  before(:each) do
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    # @user = FactoryGirl.build(:user, full_name: "Antony THEMAN",
    #                                   email: "asdf@example.com",
    #                                   password: "password",
    #                                   password_confirmation: "password",
    #                                   display_name: "A DAWG",
    #                                   phone_number: "7742398699"
    #                                   )
    @user.send_welcome_email
  end

  it "should send welcoming email" do
    visit menu_path
     within('#exampleModal') do
      click_on "Signup"
      fill_in "full_name", :with => "Pho King"
      fill_in "display_name", :with => "Phoking"
      fill_in "email", :with => "phoking@sob.com"
      fill_in "password", :with => "password"
      fill_in "password-confirmation", :with => "password"
    end
    click_on "Signup"
    assert_content page, 'Welcome to Beary Hungry', email.body
    assert_equal "Welcome to Bearly Hungry", email.subject
  end
end
