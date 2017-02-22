import  config from "../../utils/config";
import  model from "../../utils/model";

Page({
    data: {},
    onLoad(query){
        this.query = query;
        this.loadMovieInfo();
    },

    loadMovieInfo()
    {
        let that = this;
        let param = {
            public_signal_short: "bgdyy",
            movie_no: this.query.movieno,
            cinema_no: "1004676"
        };
        model.post(config.apiUrls.movieDetail, param, (result, msg) => {
            let {data}=result;
            console.log(JSON.stringify(data));
            if (data)that.setData(data);
        });
    },

    onReady(){

    },
    onShow(){

    },
    onHide(){

    },
    onUnload(){

    }
})

