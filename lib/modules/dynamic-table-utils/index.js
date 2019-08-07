module.exports = {
    construct : function(self,options){
        self.pushAsset('scripts' , 'options' , {when : "user"});

        self.apos.push.browserCall('user', 'apos.create("apostrophe-browser-utils")');
        self.apos.push.browserMirrorCall('user', self);
    }
}