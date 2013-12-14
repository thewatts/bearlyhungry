require './spec/spec_helper'

describe Order do
  before(:each) do
    I18n.enforce_available_locales = false
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    @user = FactoryGirl.create(:user, :guest => false, :email => "asdf@sdg.com")
  end

  after(:each) do
    ActionMailer::Base.deliveries.clear
  end

  it 'should send a restaurant confirmation email' do

    @user.send_new_restaurant_confirmation_email
    ActionMailer::Base.deliveries.first.to.should == [@user.email]
  end

  it 'sends a restaurant approval email' do
    @user.send_new_restaurant_approval_email
    ActionMailer::Base.deliveries.first.to.should == [@user.email]

  end

  it 'sends a restaurant rejection email' do
    @user.send_new_restaurant_rejection_email
    ActionMailer::Base.deliveries.first.to.should == [@user.email]

  end
end
