require 'spec_helper'

describe OrderItemsController do

  describe "#create" do
    before do
      @restaurant = FactoryGirl.create(:restaurant)
      @restaurant2 = FactoryGirl.create(:restaurant, :name => "BK", 
                                                     :slug => "bk")
      @order1 = FactoryGirl.create(:order, :restaurant => @restaurant)
      @order2 = FactoryGirl.create(:order, :restaurant => @restaurant2)
      @item = FactoryGirl.create(:item, :restaurant => @restaurant)
      request.env["HTTP_REFERER"] = root_path
      @order_key = "#{@restaurant.slug}_order_id".to_sym
    end

    context "order status defaults to pending" do
      it "adds an order item" do
        session[@order_key] = @order1.id
        expect(@order1.order_items.count).to eq(0)

        post :create, order_item: {item_id: @item.id, quantity: 5},
                      slug: @restaurant.slug
        expect(@order1.order_items.count).to eq(1)
      end
    end
    
    context "an invalid order" do
      it "doesn't add an order item" do
        session[@order_key] = @order2.id
        expect(@order1.order_items.count).to eq(0)

        post :create, order_item: { item_id: @item.id, quantity: 5 },
                      slug: @restaurant.slug
        expect(@order1.order_items.count).to eq(0)
      end
    end

    context "the restaurant doesn't have that item" do
      it "shouldn't update the order's order_item count"
    end
  end

  describe "#destroy" do

    before do
      @restaurant = FactoryGirl.create(:restaurant)
      FactoryGirl.create(:item, :restaurant => @restaurant)
      @order1 = FactoryGirl.create(:order, :restaurant => @restaurant)
      @order2 = FactoryGirl.create(:order)
      @order_item1 = FactoryGirl.create(:order_item, order_id: @order1.id)
      @order_key = "#{@restaurant.slug}_order_id".to_sym
    end

    context "a valid order" do
      it "destroys an order item" do
        session[@order_key] = @order1.id
        expect(Order.count).to eq(2)
        expect(OrderItem.count).to eq(1)
        expect(@order1.order_items.count).to eq(1)

        delete :destroy, id: @order_item1.id,
                         slug: @restaurant.slug
        expect(OrderItem.count).to eq(0)
        expect(@order1.order_items.count).to eq(0)
        expect(session[@order_key]).to eq(1)
      end
    end

    context "for an invalid order" do
      it "cannot destroy an order item" do
        session[@order_key] = 2
        delete :destroy, id: @order_item1.id,
                         slug: @restaurant.slug
        expect(@order1.order_items.count).to eq(1)
        expect(session[@order_key]).to eq(2)
      end
    end

  end

end
