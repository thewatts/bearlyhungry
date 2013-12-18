require './spec/spec_helper'

describe Order do
  before(:each) do
    I18n.enforce_available_locales = false
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    @user = FactoryGirl.create(:user, :admin_status => false, :guest => false, :email => "asdf@sdg.com")
    @restaurant = FactoryGirl.create(:restaurant)
    @admin = FactoryGirl.create(:user, :admin_status => true, :email => "admin@admin.com")
  end

  after(:each) do
    ActionMailer::Base.deliveries.clear
  end

  xit 'should send a restaurant confirmation email' do
    @restaurant.send_new_restaurant_confirmation_email(@user)
    ActionMailer::Base.deliveries.count.should == 1
    # ActionMailer::Base.deliveries.first.to.should == [@user.email]
  end


  it 'sends a restaurant approval email' do
    @restaurant.send_new_restaurant_approval_email(@user)
    ActionMailer::Base.deliveries.first.to.should == [@user.email]

  end

  it 'sends a restaurant rejection email' do
    @restaurant.send_new_restaurant_rejection_email(@user)
    ActionMailer::Base.deliveries.first.to.should == [@user.email]
  end

  it 'sends a restaurant submitted email' do
    @restaurant.send_new_restaurant_submitted_email
    ActionMailer::Base.deliveries.last.to.should == [@admin.email]
  end

end
