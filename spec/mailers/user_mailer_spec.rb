require './spec/spec_helper'
  
describe User do
  before(:each) do
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    @user = FactoryGirl.build(:user, full_name: "Antony THEMAN",
                                      email: "asdf@example.com",
                                      password: "password",
                                      password_confirmation: "password",
                                      display_name: "A DAWG",
                                      phone_number: "7742398699"
                                      )
    
  end

  after(:each) do
    ActionMailer::Base.deliveries.clear
  end

  it 'should send an email' do
    @user.send_welcome_email
    ActionMailer::Base.deliveries.count.should == 1
  end

  it 'renders the receiver email' do
    @user.send_welcome_email
    ActionMailer::Base.deliveries.first.to.should.to_s == @user.email
  end

  it 'sends a '
end
