# %%
import src.pyama_web.core.pyama_util as pyama_util
import src.pyama_web.backend.gui as gui

AG_MOON = str(pyama_util.moonraedler_dir())

# %%
# Segment position(s)

# Path to ND2 File
nd2_path = AG_MOON + '/Judith/Students/Simon_Master/230505_TF73_HuH7.nd2'

# Output directory (will create a new folder per position in here)
out_dir = AG_MOON + '/SPrins/Pyama_Test/Multi_FL_Test'

# Positions to evaluate (zero based so position 1 would be 0, 2 would be 1 etc)
# Comma seperated inside square brackets e.g. [1,2,3]
# Empty brackets for all positions e.g. []
positions = [70,71]

# Starting frame zero based
# Set to None to ignore
frame_min = None

# End frame zero based (zero based)
# Set to None to ignore
frame_max = None

# Channel to use for segmentation (zero based)
segmentation_channel = 0

# Channel(s) to use for fluorescence tracks (zero based)
# Comma separated inside square brackets
fluorescence_channels = [1,2]

pyama_util.segment_positions(nd2_path,out_dir,positions, segmentation_channel, fluorescence_channels,frame_min=frame_min,frame_max=frame_max)

# %%
#  CellViewer GUI
# Keybinds:
# c: rotate through channels
# arrowkey (left/right): previous/next frame
# ctl + arrowkey (left/right): same as above but 10 frames instead of just 1
# arrowkey (down/up): previous/next cell
# ctrl + enter: toggle cell (enabled/disabled)

nd2_dir = AG_MOON + '/Judith/Students/Simon_Master/230505_TF73_HuH7.nd2'
out_dir = AG_MOON + '/SPrins/Pyama_Test/Multi_FL_Test'

gui.CellViewer(nd2_dir, out_dir).show()

# %%
# Track position(s)

# Output directory (same as for segmentation)
out_dir = AG_MOON + '/SPrins/Pyama_Test/Multi_FL_Test'

# Positions to evaluate (zero based so position 1 would be 0, 2 would be 1 etc)
# Folder names inside output directory are already zero based so XY001 would be 1 but the second position of the file
# Comma seperated inside square brackets e.g. [1,2,3]
# Empty brackets for all positions e.g. [] (will look for all folders in output directory that have been segmented and perform tracking on them)
positions = [70,71]

# Expand labels during tracking (can help if cells move a lot so that overlap between frames is not guaranteed)
# Grows the labels for tracking by the amount of pixels in each direction
expand_labels = 0

pyama_util.tracking_pyama(out_dir,positions,expand=expand_labels)

# %%
# Perform square ROIs "segmentation" for position(s)

# Output directory (same as for segmentation)
out_dir = AG_MOON + '/SPrins/Pyama_Test/Multi_FL_Test'

# Positions to evaluate (same as tracking)
positions = [70,71]

# size in um of box to use for squares (width,height = 2*square_um_size)
square_um_size = 30

pyama_util.square_roi(out_dir,positions,square_um_size)

# %%
# Convert position output to excel file for position(s) (old pyama output format)

# Output directory (same as for segmentation)
out_dir = AG_MOON + '/SPrins/Pyama_Test/Multi_FL_Test'

# Positions to evaluate (same as tracking)
positions = [70,71]

# How many minutes are between each frame (for time in output)
minutes_per_frame = 5

pyama_util.csv_output(out_dir,positions,minutes_per_frame)

# %%



