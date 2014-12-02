module Api
	class RidesController < ApiController
		def new
			@ride = Ride.new
		end

		# def edit
		# 	@ride = Ride.find(params[:id])
		# 	render json: @ride
		# end

		
	    def update
	      @ride = Ride.find(params[:id])
	      if @ride.update_attributes(ride_params)
	        render json: @ride
	      else
	        render json: @ride.errors.full_messages,
           	status: :unprocessable_entity
	      end
	    end

		def create			
			@ride = Ride.new(ride_params)
			@ride.user_id = current_user.id
			if @ride.save
				render :json => @ride
			else
				flash.now[:errors] = @ride.errors.full_messages
				render :new
			end
		end

		def index
			rides = current_user.rides
			rides.push(current_user.followed_rides)
			@ride_set = rides
			render json: @ride_set
		end

		def show
			@ride = Ride.find(params[:id])
			render json: @ride
		end

		private
		def ride_params
			params.require(:ride).permit(:user_id, :title, :date, :directions, :distance, :elevation)
		end
	end
end