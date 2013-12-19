require './spec/spec_helper'

describe Order do
  before(:each) do
    # I18n.enforce_available_locales = false
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    @user = FactoryGirl.create(:user, :admin_status => false, :guest => false, :email => "asdf@sdg.com")
    @user2 = FactoryGirl.create(:user, :admin_status => false, :guest => false, :email => "asdf2@sdg.com")
    @restaurant = FactoryGirl.create(:restaurant)
    Role.create([{ name: "Owner"}])
    @restaurant.add_owner(@user)
    @restaurant.add_owner(@user2)
    @admin = FactoryGirl.create(:user, :admin_status => true, :email => "admin@admin.com")
    ActionMailer::Base.deliveries.clear

  end

  after(:each) do
    ActionMailer::Base.deliveries.clear
  end

  it 'should send a restaurant confirmation email' do
    @restaurant.send_new_restaurant_confirmation_email
    ActionMailer::Base.deliveries.count.should == 2
    ActionMailer::Base.deliveries.first.to.should == [@user.email]
  end


  it 'sends a restaurant approval email' do
    @restaurant.send_new_restaurant_approval_email
    ActionMailer::Base.deliveries.count.should == 2
    ActionMailer::Base.deliveries.first.to.should == [@user.email]

  end

  it 'sends a restaurant approval email to multiple owners of same restaurant' do
    @restaurant.send_new_restaurant_approval_email
    ActionMailer::Base.deliveries.first.to.should == [@user.email]
    ActionMailer::Base.deliveries.last.to.should == [@user2.email]
    ActionMailer::Base.deliveries.count.should == 2
  end

  it 'sends a restaurant rejection email' do
    @restaurant.send_new_restaurant_rejection_email
    ActionMailer::Base.deliveries.count.should == 2
    ActionMailer::Base.deliveries.first.to.should == [@user.email]
  end

  it 'sends a restaurant submitted email' do
    @restaurant.send_new_restaurant_submitted_email
    ActionMailer::Base.deliveries.last.to.should == [@admin.email]
  end

end
