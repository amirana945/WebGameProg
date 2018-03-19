import * as Utils from '../utils/utils'
import * as Assets from '../assets'

export default class Boot extends Phaser.State {
    public preload(): void {
       
       
        this.game.load.atlasJSONArray(Assets.Atlases.AtlasesPreloadSpritesArray.getName(), Assets.Atlases.AtlasesPreloadSpritesArray.getPNG(), Assets.Atlases.AtlasesPreloadSpritesArray.getJSONArray())
        this.game.load.atlasJSONArray(Assets.Atlases.AtlasesMonkeysheet.getName(), Assets.Atlases.AtlasesMonkeysheet.getPNG(), Assets.Atlases.AtlasesMonkeysheet.getJSONArray())
        // this.game.load.atlasJSONHash(Assets.Atlases.AtlasesPreloadSpritesHash.getName(), Assets.Atlases.AtlasesPreloadSpritesHash.getPNG(), Assets.Atlases.AtlasesPreloadSpritesHash.getJSONHash());
        // this.game.load.atlasXML(Assets.Atlases.AtlasesPreloadSpritesXml.getName(), Assets.Atlases.AtlasesPreloadSpritesXml.getPNG(), Assets.Atlases.AtlasesPreloadSpritesXml.getXML());
    }

    public create(): void {
 

        this.game.scale.scaleMode = Phaser.ScaleManager[SCALE_MODE]

        if (SCALE_MODE === 'USER_SCALE') {
            let screenMetrics: Utils.ScreenMetrics = Utils.ScreenUtils.screenMetrics

            this.game.scale.setUserScale(screenMetrics.scaleX, screenMetrics.scaleY)
        }

        this.game.scale.pageAlignHorizontally = true
        this.game.scale.pageAlignVertically = true

        if (this.game.device.desktop) {
          
        } else {
           

            
            this.game.scale.forceOrientation(true, false)
           
        }

        console.log(
            `DEBUG....................... ${DEBUG}
           \nSCALE_MODE.................. ${SCALE_MODE}
           \nDEFAULT_GAME_WIDTH.......... ${DEFAULT_GAME_WIDTH}
           \nDEFAULT_GAME_HEIGHT......... ${DEFAULT_GAME_HEIGHT}
           \nMAX_GAME_WIDTH.............. ${MAX_GAME_WIDTH}
           \nMAX_GAME_HEIGHT............. ${MAX_GAME_HEIGHT}
           \ngame.width.................. ${this.game.width}
           \ngame.height................. ${this.game.height}
           \nGOOGLE_WEB_FONTS............ ${GOOGLE_WEB_FONTS}
           \nSOUND_EXTENSIONS_PREFERENCE. ${SOUND_EXTENSIONS_PREFERENCE}`
        );

        this.game.state.start('preloader')
    }
}
