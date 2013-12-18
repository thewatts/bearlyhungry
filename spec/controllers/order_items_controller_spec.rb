require 'spec_helper'

describe OrderItemsController do

  before do
    request.env["HTTP_REFERER"] = root_path
    @mcdonalds  = FactoryGirl.create(:restaurant, :name => "McDonalds",
                                                  :slug => "mcdonalds")
    @burgerking = FactoryGirl.create(:restaurant, :name => "BK",
                                                  :slug => "bk")

    @mcdonalds_order  = FactoryGirl.create(:order, :restaurant => @mcdonalds)
    @burgerking_order = FactoryGirl.create(:order, :restaurant => @burgerking)

    @big_mac = FactoryGirl.create(:item, :title => "Big Mac",
                                         :restaurant => @mcdonalds)
    @order_key = "#{@mcdonalds.slug}_order_id".to_sym
  end

  describe "#create" do

    context "order status defaults to pending" do
      it "adds an order item" do
        session[@order_key] = @mcdonalds.id
        expect(@mcdonalds_order.order_items.count).to eq(0)

        post :create, order_item: {item_id: @big_mac.id, quantity: 5},
                      slug: @mcdonalds.slug
        expect(@mcdonalds_order.order_items.count).to eq(1)
      end
    end

    context "the restaurant doesn't have that item" do
      it "shouldn't update the order's order_item count" do
        session["#{@burgerking.slug}_order_id"] = @burgerking.id
        expect(@burgerking_order.order_items.count).to eq(0)

        post :create, order_item: { item_id: @big_mac.id, quantity: 5 },
                      slug: @burgerking.slug
        expect(@burgerking_order.order_items.count).to eq(0)
      end
    end
  end

  describe "#destroy" do

    context "a valid order" do

      it "destroys an order item" do
        @order_key = "#{@mcdonalds.slug}_order_id".to_sym
        @mcdonalds_order.add_item(@big_mac, 5)

        session[@order_key] = @mcdonalds_order.id
        expect(@mcdonalds_order.order_items.count).to eq(1)

        delete :destroy, id: @mcdonalds_order.order_items.first.id,
                         slug: @mcdonalds.slug
        expect(OrderItem.count).to eq(0)
        expect(@mcdonalds_order.order_items.count).to eq(0)
        expect(session[@order_key]).to eq(@mcdonalds_order.id)
      end
    end

    context "for an invalid order" do
      let!(:order_item) { FactoryGirl.create(:order_item, order: @burkerking_order) }
      it "cannot destroy an order item" do
        @mcdonalds_order.add_item(@big_mac, 5)
        expect(@mcdonalds_order.order_items.count).to eq(1)

        @order_key = "#{@mcdonalds.slug}_order_id".to_sym
        session[@order_key] = @mcdonalds_order.id
        delete :destroy, id: order_item.id,
                         slug: @mcdonalds.slug
        expect(@mcdonalds_order.order_items.count).to eq(1)
        expect(session[@order_key]).to eq(@mcdonalds_order.id)
      end
    end

  end

end
